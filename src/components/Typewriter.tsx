import { useEffect, useRef, useState } from "react";

/**
 * Streams `text` in character-by-character (typewriter effect) on mount,
 * ~18ms per character. Plays only once per browser session (keyed by `id`),
 * and won't replay on re-render.
 */
export function Typewriter({
  text,
  id,
  speed = 18,
  className,
}: {
  text: string;
  id: string;
  speed?: number;
  className?: string;
}) {
  const storageKey = `nafaiq:typed:${id}`;
  const alreadyPlayed =
    typeof window !== "undefined" && window.sessionStorage.getItem(storageKey) === "1";

  const [shown, setShown] = useState(alreadyPlayed ? text : "");
  const startedRef = useRef(false);

  useEffect(() => {
    if (alreadyPlayed || startedRef.current) return;
    startedRef.current = true;

    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        try {
          window.sessionStorage.setItem(storageKey, "1");
        } catch {
          /* ignore */
        }
      }
    }, speed);

    return () => clearInterval(timer);
    // Intentionally run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className={className}>
      {shown}
      {!alreadyPlayed && shown.length < text.length && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-current align-middle" />
      )}
    </span>
  );
}
