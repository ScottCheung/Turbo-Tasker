import Timer from "@/components/Timer";

type HeaderProps = {
  totalRemaining: number;
  assessmentStarted: boolean;
  canStartMainAnswer: boolean;
  onStart: () => void;
  onReset: () => void;
};

export default function Header({
  totalRemaining,
  assessmentStarted,
  canStartMainAnswer,
  onStart,
  onReset
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-[72px] max-w-[1728px] items-center justify-between gap-5 px-5 py-3 lg:px-8">
        <div className="min-w-0">
          <p className="truncate text-[clamp(0.82rem,0.7rem+0.2vw,1rem)] font-bold uppercase tracking-[0.22em] text-accent">
            Assessment Copilot
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-7">
          <div className="text-right">
            <p className="text-[clamp(0.68rem,0.58rem+0.15vw,0.82rem)] font-bold uppercase tracking-[0.16em] text-muted">
              Total left
            </p>
            <Timer milliseconds={totalRemaining} className="text-[clamp(1.55rem,1.25rem+0.75vw,2.25rem)] font-semibold text-ink" />
          </div>
          <div className="hidden items-center gap-2 border-l border-line pl-4 md:flex">
            <a
              href="/speaking-notes"
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-2.5 py-2 text-[clamp(0.78rem,0.7rem+0.15vw,0.95rem)] text-muted transition-colors hover:bg-slate-100 hover:text-ink"
            >
              Speaking notes
            </a>
            {!assessmentStarted || canStartMainAnswer ? (
              <button
                type="button"
                onClick={onStart}
                className="rounded-md bg-accent px-3.5 py-2 text-[clamp(0.78rem,0.7rem+0.15vw,0.95rem)] font-semibold text-white transition-colors hover:bg-[#124c7b]"
              >
                Start
              </button>
            ) : null}
            {assessmentStarted ? (
              <button
                type="button"
                onClick={onReset}
                className="rounded-md px-2.5 py-2 text-[clamp(0.78rem,0.7rem+0.15vw,0.95rem)] text-muted transition-colors hover:bg-slate-100 hover:text-ink"
              >
                Restart
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-5 py-2 md:hidden">
        <a
          href="/speaking-notes"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-md px-3 py-2 text-[clamp(0.78rem,0.7rem+0.15vw,0.95rem)] text-muted"
        >
          Speaking notes
        </a>
        {!assessmentStarted || canStartMainAnswer ? (
          <button
            type="button"
            onClick={onStart}
            className="shrink-0 rounded-md bg-accent px-3 py-2 text-[clamp(0.78rem,0.7rem+0.15vw,0.95rem)] font-semibold text-white"
          >
            Start
          </button>
        ) : null}
        {assessmentStarted ? (
          <button type="button" onClick={onReset} className="shrink-0 rounded-md px-3 py-2 text-[clamp(0.78rem,0.7rem+0.15vw,0.95rem)] text-muted">
            Restart
          </button>
        ) : null}
      </div>
    </header>
  );
}
