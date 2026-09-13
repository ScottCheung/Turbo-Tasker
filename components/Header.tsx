import Timer from "@/components/Timer";

type HeaderProps = {
  totalRemaining: number;
  currentTitle: string;
  sectionRemaining: number | null;
  sectionOver: boolean;
  assessmentStarted: boolean;
  mainAnswerStarted: boolean;
  canStartMainAnswer: boolean;
  onStartAssessment: () => void;
  onStartMainAnswer: () => void;
  onReset: () => void;
};

export default function Header({
  totalRemaining,
  currentTitle,
  sectionRemaining,
  sectionOver,
  assessmentStarted,
  mainAnswerStarted,
  canStartMainAnswer,
  onStartAssessment,
  onStartMainAnswer,
  onReset
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-5 px-5 py-3 lg:px-8">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold uppercase tracking-[0.22em] text-accent">Assessment Copilot</p>
          <p className="mt-1 text-xs text-muted">Local JSON view</p>
        </div>

        <div className="flex items-center gap-4 sm:gap-7">
          <div className="hidden text-right sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Current</p>
            <p className="max-w-[170px] truncate text-sm font-semibold text-ink">{currentTitle}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Total left</p>
            <Timer milliseconds={totalRemaining} className="text-xl font-semibold text-ink sm:text-2xl" />
          </div>
          <div className="hidden text-right md:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Section left</p>
            <Timer
              milliseconds={sectionRemaining}
              over={sectionOver}
              className={`text-xl font-semibold ${sectionOver ? "text-red-600" : "text-ink"}`}
            />
          </div>
          <div className="hidden items-center gap-2 border-l border-line pl-4 md:flex">
            {!assessmentStarted ? (
              <button
                type="button"
                onClick={onStartAssessment}
                className="rounded-md bg-accent px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#124c7b]"
              >
                Start assessment
              </button>
            ) : null}
            {canStartMainAnswer ? (
              <button
                type="button"
                onClick={onStartMainAnswer}
                className="rounded-md border border-accent px-3.5 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent-soft"
              >
                Start main answer
              </button>
            ) : null}
            {mainAnswerStarted ? (
              <span className="rounded-md bg-accent-soft px-3.5 py-2 text-xs font-semibold text-accent">Main answer active</span>
            ) : null}
            {assessmentStarted ? (
              <button
                type="button"
                onClick={onReset}
                className="rounded-md px-2.5 py-2 text-xs text-muted transition-colors hover:bg-slate-100 hover:text-ink"
              >
                Reset
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-5 py-2 md:hidden">
        {!assessmentStarted ? (
          <button
            type="button"
            onClick={onStartAssessment}
            className="shrink-0 rounded-md bg-accent px-3 py-2 text-xs font-semibold text-white"
          >
            Start assessment
          </button>
        ) : null}
        {canStartMainAnswer ? (
          <button
            type="button"
            onClick={onStartMainAnswer}
            className="shrink-0 rounded-md border border-accent px-3 py-2 text-xs font-semibold text-accent"
          >
            Start main answer
          </button>
        ) : null}
        {mainAnswerStarted ? (
          <span className="shrink-0 rounded-md bg-accent-soft px-3 py-2 text-xs font-semibold text-accent">Main answer active</span>
        ) : null}
        {assessmentStarted ? (
          <button type="button" onClick={onReset} className="shrink-0 rounded-md px-3 py-2 text-xs text-muted">
            Reset
          </button>
        ) : null}
      </div>
    </header>
  );
}
