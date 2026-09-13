import type { AssessmentSection } from "@/types/assessment";
import MermaidDiagram from "@/components/MermaidDiagram";
import Timer from "@/components/Timer";

type SectionProps = {
  section: AssessmentSection;
  sectionRemaining: number | null;
  sectionOver: boolean;
  registerSection: (id: string, element: HTMLElement | null) => void;
};

export default function Section({
  section,
  sectionRemaining,
  sectionOver,
  registerSection
}: SectionProps) {
  return (
    <section
      id={section.id}
      ref={(element) => registerSection(section.id, element)}
      className="scroll-mt-24 border-t border-line py-10 first:border-t-0 first:pt-2"
      aria-labelledby={`${section.id}-title`}
    >
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
            Section
          </p>
          <h2 id={`${section.id}-title`} className="text-2xl font-semibold tracking-[-0.02em] text-ink">
            {section.title}
          </h2>
        </div>
        <div className={`text-right ${sectionOver ? "text-red-600" : "text-ink"}`}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Section left</p>
          <Timer
            milliseconds={sectionRemaining}
            over={sectionOver}
            className="text-lg font-semibold"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(250px,0.72fr)]">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Key points</p>
          <ul className="space-y-3">
            {section.points.map((point) => (
              <li key={point} className="flex gap-3 text-[17px] leading-7 text-ink">
                <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-l border-line pl-5 lg:pl-7">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Speaking notes</p>
          <ul className="space-y-3">
            {section.speakingNotes.map((note) => (
              <li key={note} className="text-sm leading-6 text-slate-600">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {section.diagram ? (
        <div className="mt-8 rounded-lg border border-line bg-white p-5 shadow-panel">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Architecture diagram</p>
          <MermaidDiagram chart={section.diagram} />
        </div>
      ) : null}
    </section>
  );
}
