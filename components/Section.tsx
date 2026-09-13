import type { AssessmentSection } from "@/types/assessment";
import MermaidDiagram from "@/components/MermaidDiagram";

type SectionProps = {
  section: AssessmentSection;
  registerSection: (id: string, element: HTMLElement | null) => void;
};

export default function Section({ section, registerSection }: SectionProps) {
  return (
    <section
      id={section.id}
      ref={(element) => registerSection(section.id, element)}
      className="flex min-h-[calc(100dvh-88px)] max-md:min-h-[calc(100dvh-136px)] scroll-mt-24 max-md:scroll-mt-36 flex-col justify-center overflow-x-clip py-12 lg:py-16"
      aria-labelledby={`${section.id}-title`}
    >
      <h2
        id={`${section.id}-title`}
        className="text-[clamp(1.9rem,1.35rem+1.35vw,2.85rem)] font-semibold tracking-[-0.025em] text-ink"
      >
        {section.title}
      </h2>

      <div
        className={`mt-[clamp(2.25rem,6vh,4.5rem)] w-full ${
          section.visual ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)] lg:gap-14" : ""
        }`}
      >
        <ul className={`grid gap-y-7 ${section.visual ? "max-w-[430px]" : "max-w-[880px]"}`}>
          {section.points.map((point) => (
            <li
              key={point}
              className="flex gap-3 text-[clamp(1.06rem,0.9rem+0.4vw,1.35rem)] leading-[1.65] text-ink"
            >
              <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {section.visual ? (
          <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
            <p className="mb-4 text-[clamp(0.72rem,0.62rem+0.15vw,0.86rem)] font-bold uppercase tracking-[0.2em] text-muted">
              Visual
            </p>
            <MermaidDiagram chart={section.visual} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
