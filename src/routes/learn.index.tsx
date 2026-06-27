import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Check, Lock, Layers, X, RotateCcw, ArrowRight } from "lucide-react";
import { Card } from "@/components/Card";
import { LESSONS, GLOSSARY } from "@/lib/finance-data";
import { LEARNING_PATHS, LESSON_ID_BY_TITLE, LESSON_CONTENT, FLASHCARDS } from "@/lib/learn-data";
import { useLearn } from "@/hooks/use-learn";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Learn Hub — NafaIQ" },
      { name: "description", content: "Learn PSX investing from candlesticks to halal investing — lessons, videos, quizzes and an AI tutor, in plain Urdu and English." },
    ],
  }),
  component: Learn,
});

const XP_GOAL = 500;

function StatChip({ emoji, label, color }: { emoji: string; label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
      style={{ color, borderColor: `${color}40`, background: `${color}14` }}
    >
      <EmojiIcon emoji={emoji} size={14} />
      {label}
    </span>
  );
}

function CompletionRing({ status }: { status: string }) {
  if (status === "complete") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bull text-bull-foreground">
        <Check className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="relative h-6 w-6 rounded-full border-2 border-warning">
        <span className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-warning/70" />
      </span>
    );
  }
  return <span className="h-6 w-6 rounded-full border-2 border-border" />;
}

function Learn() {
  const { xp, statusOf, pathProgress } = useLearn();
  const [search, setSearch] = useState("");
  const [flashcards, setFlashcards] = useState(false);

  const lessonsDone = useMemo(
    () => LESSONS.filter((l) => statusOf(LESSON_ID_BY_TITLE[l.title]) === "complete").length,
    [statusOf],
  );

  const terms = GLOSSARY.filter((t) => t.en.toLowerCase().includes(search.toLowerCase()));
  const xpPct = Math.min(100, Math.round((xp / XP_GOAL) * 100));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Hero */}
      <Card hover={false} className="bg-gradient-to-br from-ai-tint to-surface">
        <h1 className="font-urdu text-2xl text-text-primary">سمجھو، سیکھو، بڑھو</h1>
        <p className="text-sm font-semibold text-text-primary">Samjho, Seekho, Barho</p>
        <p className="mt-1 text-sm text-text-secondary">From KSE basics to technical analysis — in plain Urdu and English.</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-[4px] bg-elevated px-2 py-1 text-xs text-text-secondary">Beginner Investor · {lessonsDone} lessons complete</span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-40 overflow-hidden rounded-full bg-elevated">
              <div className="h-full rounded-full bg-bull transition-all duration-700" style={{ width: `${xpPct}%` }} />
            </div>
            <span className="font-mono text-xs tabular-nums text-text-muted">{xp} / {XP_GOAL} XP</span>
          </div>
        </div>

        {/* Learning stats bar */}
        <div className="mt-4 flex flex-wrap gap-2">
          <StatChip emoji="🔥" label="5 Day Streak" color="#f59e0b" />
          <StatChip emoji="✅" label={`${lessonsDone} Lessons Done`} color="#00d4aa" />
          <StatChip emoji="⭐" label={`${xp} XP Earned`} color="#eab308" />
          <StatChip emoji="🏆" label="Beginner Level" color="#8b5cf6" />
        </div>
      </Card>

      {/* Learning Paths */}
      <section>
        <h3 className="text-sm font-semibold text-text-primary">Learning Paths</h3>
        <p className="mb-3 text-xs text-text-secondary">Follow a structured track or explore freely</p>
        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2">
          {LEARNING_PATHS.map((p) => {
            const progress = pathProgress(p.lessonIds);
            const firstUnfinished = p.lessonIds.find((l) => statusOf(l) !== "complete") ?? p.lessonIds[0];
            return (
              <div
                key={p.id}
                className="group min-w-[220px] flex-1 rounded-[12px] border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-border-hover hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                style={{ borderLeft: `3px solid ${p.accent}` }}
              >
                <div className="text-2xl">{p.emoji}</div>
                <div className="mt-2 text-sm font-semibold text-text-primary">{p.title}</div>
                <div className="mt-0.5 text-xs text-text-secondary">{p.description}</div>
                <div className="mt-2 font-mono text-[11px] text-text-muted">{p.lessonIds.length} lessons · Est: {p.estMin} min</div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-elevated">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: p.accent }} />
                </div>
                <div className="mt-1 text-[10px] font-medium text-text-muted">{progress}% complete</div>
                <Link
                  to="/learn/lesson/$id"
                  params={{ id: firstUnfinished }}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-[8px] px-3 py-2 text-xs font-semibold transition-colors"
                  style={{ background: `${p.accent}1a`, color: p.accent }}
                >
                  {progress > 0 ? "Continue Path" : "Start Path"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lessons */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-text-primary">Lessons</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LESSONS.map((l) => {
            const id = LESSON_ID_BY_TITLE[l.title];
            const status = statusOf(id);
            const content = LESSON_CONTENT[id];
            const isVideo = content?.type === "video";
            return (
              <Link key={l.title} to="/learn/lesson/$id" params={{ id }}>
                <Card className="group h-full transition-all hover:-translate-y-[3px] hover:border-bull">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-xl">{l.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-text-primary">{l.title}</div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                        <span className="rounded-[4px] bg-elevated px-1.5 py-0.5 text-text-muted">{l.duration}</span>
                        <span className="rounded-[4px] bg-elevated px-1.5 py-0.5 text-text-muted">{l.level}</span>
                      </div>
                    </div>
                    <CompletionRing status={status} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-[4px] bg-elevated px-2 py-0.5 text-[10px] text-text-secondary">
                      {isVideo ? "🎬 Video + Article" : "📖 Article"}
                    </span>
                    {status === "in-progress" && <span className="text-[10px] font-medium text-warning">In Progress</span>}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Glossary */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-primary">Glossary</h3>
          <button
            onClick={() => setFlashcards(true)}
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-bull/40 bg-bull/10 px-3 py-1.5 text-xs font-semibold text-bull hover:bg-bull/20"
          >
            <Layers className="h-3.5 w-3.5" /> 🃏 Flashcard Mode
          </button>
        </div>
        <div className="mb-3 flex items-center gap-2 rounded-[6px] border border-border bg-surface px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search terms" className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted" />
        </div>
        <div className="space-y-2">
          {terms.map((t) => (
            <details key={t.en} className="group rounded-[8px] border border-border bg-surface p-3">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-text-primary">
                <span>{t.en}</span>
                <span className="font-urdu text-base text-text-secondary">{t.ur}</span>
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">{t.def}</p>
            </details>
          ))}
        </div>
      </section>

      {flashcards && <FlashcardModal onClose={() => setFlashcards(false)} />}
    </div>
  );
}

function FlashcardModal({ onClose }: { onClose: () => void }) {
  const [deck, setDeck] = useState(FLASHCARDS.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const total = FLASHCARDS.length;
  const done = pos >= deck.length;
  const card = !done ? FLASHCARDS[deck[pos]] : null;
  const reviewed = total - (deck.length - pos);

  function next() {
    setFlipped(false);
    setPos((p) => p + 1);
  }
  function reviewAgain() {
    setFlipped(false);
    setDeck((d) => [...d, d[pos]]);
    setPos((p) => p + 1);
  }
  function restart() {
    setDeck(FLASHCARDS.map((_, i) => i));
    setPos(0);
    setFlipped(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text-primary">🃏 Flashcards</span>
        <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 text-text-secondary" /></button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        {card ? (
          <>
            <button
              onClick={() => setFlipped((f) => !f)}
              className="flip-card h-72 w-full max-w-md"
              aria-label="Flip card"
            >
              <div className={cn("flip-inner", flipped && "flipped")}>
                <div className="flip-face rounded-[16px] border border-border bg-surface p-8">
                  <div className="text-2xl font-bold text-text-primary">{card.front}</div>
                  <div className="mt-3 font-urdu text-3xl text-bull">{card.ur}</div>
                  <div className="mt-6 text-xs text-text-muted">Tap to flip</div>
                </div>
                <div className="flip-face flip-back rounded-[16px] border border-bull/40 bg-surface p-8 text-center">
                  <p className="text-sm leading-relaxed text-text-secondary">{card.def}</p>
                </div>
              </div>
            </button>

            <div className="flex items-center gap-3">
              <button onClick={next} className="rounded-[8px] bg-bull px-5 py-2.5 text-sm font-semibold text-bull-foreground hover:brightness-110">✓ Got it</button>
              <button onClick={reviewAgain} className="inline-flex items-center gap-1.5 rounded-[8px] border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-hover">
                <RotateCcw className="h-4 w-4" /> Review Again
              </button>
            </div>
            <div className="font-mono text-xs text-text-muted">{Math.min(reviewed + 1, total)} / {total} terms</div>
          </>
        ) : (
          <div className="text-center">
            <div className="text-4xl">🎉</div>
            <div className="mt-3 text-lg font-semibold text-text-primary">Deck Complete!</div>
            <div className="mt-1 text-sm text-text-secondary">You reviewed all {total} terms.</div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button onClick={restart} className="rounded-[8px] bg-bull px-5 py-2.5 text-sm font-semibold text-bull-foreground hover:brightness-110">Restart Deck</button>
              <button onClick={onClose} className="rounded-[8px] border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-hover">Exit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
