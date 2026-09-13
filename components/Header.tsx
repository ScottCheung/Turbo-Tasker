import Timer from "@/components/Timer";

type HeaderProps = {
  title: string;
  taskType: string;
  currentSection: string;
  totalRemaining: number;
  assessmentStarted: boolean;
  onStart: () => void;
  onReset: () => void;
};

export default function Header({
  title,
  taskType,
  currentSection,
  totalRemaining,
  assessmentStarted,
  onStart,
  onReset
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="mx-auto grid min-h-[72px] max-w-[1728px] grid-cols-1 items-center gap-3 px-5 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_auto] md:gap-8 lg:px-8">
        <div className="min-w-0">
          <p className="mt-1 truncate text-[clamp(0.98rem,0.84rem+0.35vw,1.2rem)] font-semibold text-ink">{title}</p>
          <p className="text-[clamp(0.68rem,0.58rem+0.15vw,0.82rem)] font-bold uppercase tracking-[0.16em] text-muted">{taskType}</p>
          
        </div>


        <div className="flex items-end justify-between gap-4 md:justify-end">
          <div className="text-left md:text-right">
            <p className="text-[clamp(0.68rem,0.58rem+0.15vw,0.82rem)] font-bold uppercase tracking-[0.16em] text-muted">Total time</p>
            <Timer milliseconds={totalRemaining} className="text-[clamp(1.5rem,1.2rem+0.75vw,2.15rem)] font-semibold text-ink" />
          </div>

          <div className="flex items-center gap-1 border-l border-line pl-3">
            {!assessmentStarted ? (
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
    </header>
  );
}
