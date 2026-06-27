import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Bot,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  Inbox,
  MessageCircle,
  Send,
  Sparkles,
  Star,
  Target,
  Video,
  BookOpen,
  Cpu,
  X,
} from "lucide-react";
import { EmojiIcon } from "@/components/icons";
import {
  LESSON_CONTENT,
  lessonOrder,
  xpForScore,
  type ContentBlock,
  type LessonContent,
  type QuizQuestion,
} from "@/lib/learn-data";
import { askTutor } from "@/lib/learn-ai.functions";
import { useLearn } from "@/hooks/use-learn";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/lesson/$id")({
  head: () => ({
    meta: [{ title: "Lesson — NafaIQ Learn Hub" }],
  }),
  component: LessonPage,
});

const CALLOUT_META: Record<string, { label: string; color: string; emoji: string }> = {
  tip: { label: "Pro Tip", color: "#00d4aa", emoji: "💡" },
  warning: { label: "Important", color: "#f59e0b", emoji: "⚠️" },
  example: { label: "Real Example", color: "#6366f1", emoji: "📊" },
  note: { label: "Note", color: "#94a3b8", emoji: "📌" },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function LessonPage() {
  const { id } = useParams({ from: "/learn/lesson/$id" });
  const lesson = LESSON_CONTENT[id];

  if (!lesson) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <Inbox className="mx-auto h-8 w-8 text-text-muted" strokeWidth={1.5} />
        <h1 className="mt-3 text-lg font-semibold text-text-primary">Lesson not found</h1>
        <Link
          to="/learn"
          className="mt-4 inline-block rounded-[8px] bg-bull px-4 py-2 text-sm font-semibold text-bull-foreground"
        >
          Back to Learn Hub
        </Link>
      </div>
    );
  }

  return <LessonInner key={lesson.id} lesson={lesson} />;
}

type Mode = "reading" | "quiz" | "results";

function LessonInner({ lesson }: { lesson: LessonContent }) {
  const navigate = useNavigate();
  const { statusOf, completeLesson, bookmarks, toggleBookmark, xp } = useLearn();
  const [mode, setMode] = useState<Mode>("reading");
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(lesson.sections[0]?.id);
  const [chatOpen, setChatOpen] = useState(false);
  const [showArticle, setShowArticle] = useState(true);

  const order = lessonOrder();
  const idx = order.indexOf(lesson.id);
  const prevId = idx > 0 ? order[idx - 1] : null;
  const nextId = idx < order.length - 1 ? order[idx + 1] : null;
  const bookmarked = bookmarks.includes(lesson.id);

  // Reading progress on scroll
  useEffect(() => {
    if (mode !== "reading") return;
    function onScroll() {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  // Active TOC section
  useEffect(() => {
    if (mode !== "reading") return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );
    lesson.sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [mode, lesson.sections]);

  function scrollToSection(secId: string) {
    document.getElementById(secId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onQuizFinish(correct: number) {
    const gain = xpForScore(correct, lesson.quiz.length);
    if (correct >= 2) completeLesson(lesson.id, gain);
    return gain;
  }

  return (
    <div className="-mx-3 -mt-4 -mb-24 sm:-mx-5 lg:-mx-6 lg:-mb-8">
      {/* Reading progress bar */}
      <div className="sticky top-[52px] z-20 h-[3px] w-full bg-border">
        <div
          className="h-full bg-bull transition-[width] duration-150"
          style={{ width: `${mode === "reading" ? progress : 100}%` }}
        />
      </div>

      {/* Top bar */}
      <div className="sticky top-[55px] z-20 flex items-center gap-3 border-b border-border bg-sidebar px-3 py-2.5 lg:px-6">
        <Link
          to="/learn"
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Learn Hub</span>
        </Link>
        <div className="flex-1 truncate text-center text-sm font-semibold text-text-primary">
          {lesson.title}
        </div>
        <button
          onClick={() => setChatOpen(true)}
          className="hidden shrink-0 items-center gap-1.5 rounded-[6px] bg-bull/10 px-2.5 py-1 text-xs font-semibold text-bull hover:bg-bull/20 lg:inline-flex xl:hidden"
        >
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} /> Ask AI
        </button>
        <button
          onClick={() => toggleBookmark(lesson.id)}
          aria-label="Bookmark"
          className="shrink-0 text-text-secondary hover:text-bull"
        >
          {bookmarked ? (
            <BookmarkCheck className="h-5 w-5 text-bull" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex gap-6 px-3 py-5 lg:px-6">
        {/* Left TOC */}
        {mode === "reading" && (
          <aside className="hidden w-[220px] shrink-0 lg:block">
            <div className="sticky top-[110px]">
              <div className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                In This Lesson
              </div>
              <nav className="mt-3 space-y-1 border-l border-border">
                {lesson.sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={cn(
                      "-ml-px block border-l-2 py-1 pl-3 text-left text-xs transition-colors",
                      activeSection === s.id
                        ? "border-bull font-medium text-bull"
                        : "border-transparent text-text-secondary hover:text-text-primary",
                    )}
                  >
                    {s.heading}
                  </button>
                ))}
              </nav>
              <div className="mt-5 space-y-1.5 border-t border-border pt-4 text-xs text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} /> {lesson.duration} read
                </div>
                <div className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" strokeWidth={1.5} /> {lesson.level}
                </div>
                <div className="flex items-center gap-1.5">
                  {lesson.type === "video" && lesson.videoUrl ? (
                    <>
                      <Video className="h-3.5 w-3.5" strokeWidth={1.5} /> Video + Article
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} /> Article
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => toggleBookmark(lesson.id)}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-border px-3 py-2 text-xs font-medium text-text-secondary hover:bg-hover"
              >
                {bookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-bull" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                {bookmarked ? "Bookmarked" : "Bookmark Lesson"}
              </button>
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {mode === "reading" && (
            <ReadingView
              lesson={lesson}
              showArticle={showArticle}
              setShowArticle={setShowArticle}
              prevId={prevId}
              nextId={nextId}
              onTakeQuiz={() => {
                window.scrollTo({ top: 0 });
                setMode("quiz");
              }}
              completed={statusOf(lesson.id) === "complete"}
              onMarkWatched={() => completeLesson(lesson.id, 30)}
            />
          )}

          {mode === "quiz" && (
            <QuizView
              lesson={lesson}
              onExit={() => setMode("reading")}
              onFinish={(correct) => {
                const gain = onQuizFinish(correct);
                setMode("results");
                resultRef.current = { correct, gain };
              }}
            />
          )}

          {mode === "results" && resultRef.current && (
            <ResultsView
              lesson={lesson}
              correct={resultRef.current.correct}
              gain={resultRef.current.gain}
              startXp={xp - (resultRef.current.correct >= 2 ? resultRef.current.gain : 0)}
              nextId={nextId}
              onRetake={() => setMode("quiz")}
              onBackToLesson={() => setMode("reading")}
              onContinue={() => {
                if (nextId) navigate({ to: "/learn/lesson/$id", params: { id: nextId } });
                else navigate({ to: "/learn" });
              }}
            />
          )}
        </main>
      </div>

      {/* Floating AI button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed right-4 bottom-20 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-bull text-bull-foreground shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:brightness-110 lg:bottom-8"
        aria-label="Ask AI Tutor"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Chat sheet — bottom sheet on mobile, right-docked panel on desktop */}
      {chatOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end sm:items-end sm:justify-end sm:p-6"
          onClick={() => setChatOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative h-[80vh] rounded-t-[16px] border-t border-border bg-sidebar sm:h-[600px] sm:w-[400px] sm:rounded-[16px] sm:border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border sm:hidden" />
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary">
                <Cpu className="h-4 w-4 text-ai" strokeWidth={1.5} /> Ask AI Tutor
              </span>
              <button onClick={() => setChatOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-text-secondary" />
              </button>
            </div>
            <div className="h-[calc(80vh-56px)] sm:h-[calc(600px-56px)]">
              <ChatPanel lesson={lesson} activeSection={activeSection} embedded />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Persist quiz result across mode switches without re-render churn.
const resultRef: { current: { correct: number; gain: number } | null } = { current: null };

/* ---------------- Reading View ---------------- */

function Blocks({ blocks, accent }: { blocks: ContentBlock[]; accent: string }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "p") {
          return (
            <p key={i} className="my-4 max-w-[680px] text-[16px] leading-[1.8] text-[#cbd5e1]">
              {b.text}
            </p>
          );
        }
        if (b.type === "callout") {
          const m = CALLOUT_META[b.kind];
          return (
            <div
              key={i}
              className="my-6 max-w-[680px] rounded-r-[8px] p-4"
              style={{ background: `${m.color}10`, borderLeft: `3px solid ${m.color}` }}
            >
              <div
                className="flex items-center gap-1.5 text-xs font-bold"
                style={{ color: m.color }}
              >
                <EmojiIcon emoji={m.emoji} size={13} /> {m.label}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-[#cbd5e1]">{b.text}</p>
            </div>
          );
        }
        if (b.type === "formula") {
          return (
            <div
              key={i}
              className="my-6 max-w-[680px] rounded-[8px] border border-border bg-[#0d1421] p-5 font-mono text-sm"
            >
              {b.lines.map((line, j) => (
                <div key={j} className="text-bull">
                  {line.split("=").map((part, k, all) => (
                    <span key={k}>
                      <span className="text-text-primary">{part}</span>
                      {k < all.length - 1 && <span className="text-warning"> = </span>}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          );
        }
        // table
        return (
          <div
            key={i}
            className="my-6 max-w-[680px] overflow-x-auto rounded-[8px] border border-border"
          >
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {b.head.map((h) => (
                    <th
                      key={h}
                      className="border border-border bg-elevated px-3 py-2 text-left font-bold text-text-primary"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row, r) => (
                  <tr
                    key={r}
                    className={cn(
                      "transition-colors hover:bg-bull/[0.04]",
                      r % 2 === 0 ? "bg-surface" : "bg-surface-alt",
                    )}
                  >
                    {row.map((cell, c) => (
                      <td key={c} className="border border-border px-3 py-2 text-text-secondary">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

function ReadingView({
  lesson,
  showArticle,
  setShowArticle,
  prevId,
  nextId,
  onTakeQuiz,
  completed,
  onMarkWatched,
}: {
  lesson: LessonContent;
  showArticle: boolean;
  setShowArticle: (v: boolean) => void;
  prevId: string | null;
  nextId: string | null;
  onTakeQuiz: () => void;
  completed: boolean;
  onMarkWatched: () => void;
}) {
  const prev = prevId ? LESSON_CONTENT[prevId] : null;
  const next = nextId ? LESSON_CONTENT[nextId] : null;

  return (
    <div className="learn-fade-in">
      {/* Hero banner */}
      <div
        className="rounded-[12px] bg-gradient-to-br from-surface to-[#0d1421] p-8"
        style={{ borderLeft: `4px solid ${lesson.accent}` }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-white/[0.06] bg-elevated"
          style={{ color: lesson.accent }}
        >
          <EmojiIcon emoji={lesson.emoji} size={24} />
        </div>
        <h1 className="mt-3 text-3xl font-bold text-text-primary">{lesson.title}</h1>
        <p className="mt-1 text-sm text-text-secondary">{lesson.subtitle}</p>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span
            className="rounded-[4px] px-2 py-0.5 font-semibold"
            style={{ background: `${lesson.accent}1a`, color: lesson.accent }}
          >
            {lesson.level}
          </span>
          <span className="rounded-[4px] bg-elevated px-2 py-0.5 text-text-secondary">
            ⏱ {lesson.duration} read
          </span>
          <span className="rounded-[4px] bg-elevated px-2 py-0.5 text-text-secondary">
            {lesson.category}
          </span>
        </div>
      </div>

      {/* Video */}
      {lesson.type === "video" && lesson.videoUrl && (
        <div className="mt-6">
          <VideoPlayer url={lesson.videoUrl} />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowArticle(!showArticle)}
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-hover"
            >
              <FileText className="h-3.5 w-3.5" strokeWidth={1.5} /> {showArticle ? "Hide" : "Read"}{" "}
              Article Version
            </button>
            <button
              onClick={onMarkWatched}
              className="inline-flex items-center gap-1.5 rounded-[8px] bg-bull/10 px-3 py-1.5 text-xs font-semibold text-bull hover:bg-bull/20"
            >
              Mark Video as Watched <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
            <CheckCircle2 className="h-3.5 w-3.5 text-bull" strokeWidth={1.5} /> Watch at least 80%
            of the video to mark as complete
          </p>
        </div>
      )}

      {/* Video coming soon */}
      {lesson.type === "video" && !lesson.videoUrl && (
        <div className="mt-6 flex w-full flex-col items-center justify-center gap-2.5 rounded-[12px] border border-dashed border-border bg-surface px-6 py-8 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-text-secondary">
            <Video className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <div className="text-sm font-semibold text-text-primary">Video coming soon</div>
            <p className="mt-1 text-xs text-text-muted">
              A video walkthrough is in production. Read the full lesson below for now.
            </p>
          </div>
        </div>

      )}

      {/* Article */}
      {(lesson.type !== "video" || !lesson.videoUrl || showArticle) && (
        <article className="mt-6">
          {lesson.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-[120px]">
              <h2 className="mt-10 border-b border-border pb-2 text-[22px] font-bold text-text-primary">
                {s.heading}
              </h2>
              <Blocks blocks={s.blocks} accent={lesson.accent} />
            </section>
          ))}
        </article>
      )}

      {/* Take quiz */}
      <div className="mt-10 rounded-[12px] border border-bull/30 bg-bull/5 p-6 text-center">
        <button
          onClick={onTakeQuiz}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-bull to-[#06b6d4] px-8 py-3.5 text-base font-bold text-bull-foreground transition hover:brightness-110"
        >
          <Brain className="h-5 w-5" /> Test Your Understanding — Take the Quiz
        </button>
        <p className="mt-2 text-xs text-text-muted">
          {lesson.quiz.length} questions · Earn up to 50 XP
        </p>
        {completed && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-bull">
            <Check className="h-3.5 w-3.5" strokeWidth={1.5} /> You've completed this lesson
          </p>
        )}
      </div>

      {/* Prev / Next */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            to="/learn/lesson/$id"
            params={{ id: prev.id }}
            className="rounded-[8px] border border-border p-3 text-left hover:border-border-hover"
          >
            <div className="flex items-center gap-1 text-[10px] text-text-muted">
              <ArrowLeft className="h-3 w-3" strokeWidth={1.5} /> Previous
            </div>
            <div className="text-sm font-medium text-text-primary">{prev.title}</div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            to="/learn/lesson/$id"
            params={{ id: next.id }}
            className="rounded-[8px] border border-border p-3 text-right hover:border-border-hover"
          >
            <div className="flex items-center justify-end gap-1 text-[10px] text-text-muted">
              Next <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
            </div>
            <div className="text-sm font-medium text-text-primary">{next.title}</div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

function VideoPlayer({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[12px] border border-border bg-[#0d1421]">
      {failed ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-text-muted">
          <Video className="h-8 w-8" strokeWidth={1.5} />
          <div className="text-sm">Video loading…</div>
        </div>
      ) : (
        <iframe
          src={url}
          title="Lesson video"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

/* ---------------- Quiz View ---------------- */

interface ShuffledQ {
  q: QuizQuestion;
  options: { text: string; isCorrect: boolean }[];
}

function buildShuffled(quiz: QuizQuestion[]): ShuffledQ[] {
  return quiz.map((q) => ({
    q,
    options: shuffle(q.options.map((text, i) => ({ text, isCorrect: i === q.correct }))),
  }));
}

function QuizView({
  lesson,
  onExit,
  onFinish,
}: {
  lesson: LessonContent;
  onExit: () => void;
  onFinish: (correct: number) => void;
}) {
  const [questions] = useState(() => buildShuffled(lesson.quiz));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const total = questions.length;
  const q = questions[current];

  const answer = useCallback(
    (optIdx: number | null) => {
      if (selected !== null) return;
      const isCorrect = optIdx !== null && q.options[optIdx].isCorrect;
      if (isCorrect) setCorrectCount((c) => c + 1);
      setSelected(optIdx ?? -1);
    },
    [selected, q],
  );

  // Timer
  useEffect(() => {
    if (selected !== null) return;
    setTimeLeft(30);
    const t = setInterval(() => {
      setTimeLeft((tl) => {
        if (tl <= 1) {
          clearInterval(t);
          answer(null);
          return 0;
        }
        return tl - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [current, selected, answer]);

  function nextQuestion() {
    if (current + 1 >= total) {
      onFinish(correctCount);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  const answered = selected !== null;
  const timerColor = timeLeft > 15 ? "#00d4aa" : timeLeft > 7 ? "#f59e0b" : "#ff4d4d";

  return (
    <div className="learn-fade-in mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Lesson
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-bull/10 px-3 py-1 text-xs font-semibold text-bull">
          <Star className="h-3.5 w-3.5" strokeWidth={1.5} /> Up to 50 XP
        </span>
      </div>

      <div className="mt-4 text-xs text-text-muted">{lesson.title}</div>
      <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
        <Brain className="h-5 w-5" strokeWidth={1.5} /> Knowledge Check
      </h2>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                i < current ? "bg-bull" : i === current ? "bg-bull/60" : "bg-border",
              )}
            />
          ))}
        </div>
        <span className="text-xs text-text-secondary">
          Question {current + 1} of {total}
        </span>
      </div>

      <div className="mt-5 rounded-[16px] border border-border bg-surface p-6 sm:p-8">
        {/* Timer */}
        <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 30) * 100}%`, background: timerColor }}
          />
        </div>

        <div className="mb-6 text-[20px] font-semibold text-text-primary">{q.q.q}</div>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const labels = ["A", "B", "C", "D"];
            let stateCls = "border-border bg-[#0d1421]";
            let circleCls = "bg-elevated text-text-muted";
            let icon: React.ReactNode = null;
            if (answered) {
              if (opt.isCorrect) {
                stateCls = "border-bull bg-bull/10";
                circleCls = "bg-bull text-bull-foreground";
                icon = <Check className="h-4 w-4 text-bull" />;
              } else if (i === selected) {
                stateCls = "border-bear bg-bear/10";
                circleCls = "bg-bear text-white";
                icon = <X className="h-4 w-4 text-bear" />;
              }
            }
            const dim = answered && !opt.isCorrect && i !== selected;
            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => answer(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[10px] border px-5 py-4 text-left transition-all",
                  stateCls,
                  dim && "opacity-40",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    circleCls,
                  )}
                >
                  {labels[i]}
                </span>
                <span className="flex-1 text-sm text-text-primary">{opt.text}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className="learn-fade-in mt-5 rounded-[8px] p-4 text-sm leading-relaxed text-text-secondary"
            style={{
              background: q.options[selected]?.isCorrect
                ? "rgba(0,212,170,0.06)"
                : "rgba(229,72,77,0.06)",
            }}
          >
            <span className="font-semibold text-text-primary">
              {q.options[selected]?.isCorrect ? "Correct! " : "Not quite. "}
            </span>
            {q.q.explanation}
          </div>
        )}

        {answered && (
          <button
            onClick={nextQuestion}
            className="mt-5 inline-flex items-center gap-1.5 rounded-[8px] bg-bull px-5 py-2.5 text-sm font-semibold text-bull-foreground hover:brightness-110"
          >
            {current + 1 >= total ? "See Results" : "Next Question"}{" "}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Results View ---------------- */

function useCountUp(from: number, to: number, ms = 1000) {
  const [val, setVal] = useState(from);
  useEffect(() => {
    if (from === to) {
      setVal(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      setVal(Math.round(from + (to - from) * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, ms]);
  return val;
}

function ResultsView({
  lesson,
  correct,
  gain,
  startXp,
  nextId,
  onRetake,
  onBackToLesson,
  onContinue,
}: {
  lesson: LessonContent;
  correct: number;
  gain: number;
  startXp: number;
  nextId: string | null;
  onRetake: () => void;
  onBackToLesson: () => void;
  onContinue: () => void;
}) {
  const total = lesson.quiz.length;
  const pct = (correct / total) * 100;
  const ringColor = correct >= total ? "#00d4aa" : correct >= 2 ? "#f59e0b" : "#ff4d4d";
  const xpVal = useCountUp(startXp, startXp + gain, 1000);
  const [drawn, setDrawn] = useState(0);
  const questions = useMemo(() => buildShuffled(lesson.quiz), [lesson.quiz]);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      setDrawn(pct * p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  const message =
    correct >= total
      ? "Perfect Score! Ustād level understanding!"
      : correct === 2
        ? "Great work! One more review and you'll nail it."
        : correct === 1
          ? "📖 Keep learning — review the lesson and retry."
          : "💪 Don't give up — re-read and try again!";

  const r = 52;
  const circ = 2 * Math.PI * r;

  return (
    <div className="learn-fade-in mx-auto max-w-2xl text-center">
      <div className="text-xs text-text-muted">{lesson.title}</div>
      <h2 className="text-xl font-bold text-text-primary">Quiz Results</h2>

      <div className="relative mx-auto mt-6 h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1e2a3a" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={ringColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - (drawn / 100) * circ}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold tabular-nums" style={{ color: ringColor }}>
            {correct}/{total}
          </span>
        </div>
      </div>

      <p className="mt-4 text-base font-semibold text-text-primary">{message}</p>

      <div className="mx-auto mt-5 max-w-sm rounded-[12px] border border-bull/40 bg-bull/10 p-5">
        <div className="font-mono text-3xl font-bold text-bull">+{gain} XP</div>
        <div className="mt-1 text-xs text-text-secondary">Added to your profile</div>
        <div className="mt-2 font-mono text-sm tabular-nums text-text-muted">{xpVal} XP total</div>
      </div>

      {/* Review accordion */}
      <div className="mt-6 space-y-2 text-left">
        {questions.map((sq, i) => (
          <details key={i} className="rounded-[8px] border border-border bg-surface p-3">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-text-primary">
              <span className="flex items-center gap-2">
                <span className="text-text-muted">Q{i + 1}</span> {sq.q.q}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
            </summary>
            <div className="mt-3 space-y-1.5">
              {sq.options.map((o, j) => (
                <div
                  key={j}
                  className={cn(
                    "flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs",
                    o.isCorrect ? "bg-bull/10 text-bull" : "text-text-secondary",
                  )}
                >
                  {o.isCorrect ? (
                    <Check className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                  ) : (
                    <span className="shrink-0">•</span>
                  )}
                  {o.text}
                </div>
              ))}
              <p className="mt-2 text-xs leading-relaxed text-text-muted">{sq.q.explanation}</p>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          onClick={onContinue}
          className="inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-bull px-5 py-2.5 text-sm font-semibold text-bull-foreground hover:brightness-110"
        >
          Continue Learning <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={onRetake}
          className="rounded-[8px] border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-hover"
        >
          Retake Quiz
        </button>
        <button
          onClick={onBackToLesson}
          className="rounded-[8px] border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-hover"
        >
          Back to Lesson
        </button>
      </div>
    </div>
  );
}

/* ---------------- AI Chat Panel ---------------- */

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

function ChatPanel({
  lesson,
  activeSection,
  embedded,
}: {
  lesson: LessonContent;
  activeSection?: string;
  embedded?: boolean;
}) {
  const ask = useServerFn(askTutor);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: `Hi! I'm here to help you understand ${lesson.title}. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      const history: ChatMsg[] = [...messages, { role: "user", content: trimmed }];
      setMessages(history);
      setInput("");
      setLoading(true);
      const sectionHeading = lesson.sections.find((s) => s.id === activeSection)?.heading;
      try {
        const res = await ask({
          data: {
            lessonTitle: lesson.title,
            section: sectionHeading,
            messages: history.slice(-12),
          },
        });
        setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [ask, messages, loading, lesson, activeSection],
  );

  const showPresets = messages.length === 1;

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[12px] border border-border bg-surface",
        embedded && "rounded-none border-0",
      )}
    >
      <div className="border-b border-border p-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bull/15 text-bull">
            <Bot className="h-3.5 w-3.5" />
          </span>
          AI Tutor
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-[11px] text-text-secondary">Ask anything about this lesson</span>
          <span className="rounded-full bg-ai/15 px-1.5 py-0.5 text-[9px] font-semibold text-ai">
            Powered by AI
          </span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.map((m, i) => (
          <div key={i} className={cn("max-w-[88%]", m.role === "user" ? "ml-auto" : "")}>
            <div
              className={cn(
                "px-3 py-2 text-sm leading-relaxed",
                m.role === "user"
                  ? "rounded-[12px] rounded-br-none bg-bull text-bull-foreground"
                  : "rounded-[12px] rounded-bl-none bg-elevated text-text-primary",
              )}
            >
              {m.content}
            </div>
            {i === 0 && <div className="mt-1 text-[10px] text-text-muted">just now</div>}
          </div>
        ))}

        {showPresets && (
          <div className="space-y-1.5 pt-1">
            {lesson.presets.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="block w-full rounded-full border border-border px-3 py-1.5 text-left text-[11px] text-text-secondary hover:border-bull hover:text-bull"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-bull" /> Thinking…
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about this lesson…"
          className="flex-1 rounded-[8px] border border-border bg-elevated px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted"
        />
        <button
          onClick={() => send(input)}
          disabled={loading}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-bull text-bull-foreground disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
