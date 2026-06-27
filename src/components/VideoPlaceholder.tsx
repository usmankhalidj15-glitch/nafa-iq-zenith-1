import { Video } from "lucide-react";

export function VideoPlaceholder() {
  return (
    <div className="mx-auto mt-6 flex aspect-video w-full max-w-[720px] flex-col items-center justify-center gap-2.5 rounded-[12px] border border-dashed border-border bg-surface px-6 text-center">
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
  );
}
