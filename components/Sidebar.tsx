import type { AssessmentSection } from "@/types/assessment";

type SidebarProps = {
  sections: AssessmentSection[];
  activeSection: string;
  sectionProgress: number;
  sectionProgressById: ReadonlyMap<string, number>;
  onNavigate: (id: string) => void;
};

export default function Sidebar({
  sections,
  activeSection,
  sectionProgress,
  sectionProgressById,
  onNavigate
}: SidebarProps) {
  return (
    <aside className="relative border-b border-line bg-white lg:sticky lg:top-[73px] lg:h-[calc(100dvh-73px)] lg:w-[248px] lg:shrink-0 lg:border-b-0 lg:border-r">
      <nav className="px-2 py-5 lg:h-full lg:overflow-y-auto lg:px-5 lg:py-8 lg:pb-20" aria-label="Assessment sections">
        <p className="mb-4 px-3 text-[clamp(0.7rem,0.6rem+0.15vw,0.85rem)] font-bold uppercase tracking-[0.2em] text-muted">On this page</p>
        <div className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
          <button
            type="button"
            onClick={() => onNavigate("summary")}
            aria-current={activeSection === "summary" ? "location" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-[clamp(0.95rem,0.82rem+0.25vw,1.15rem)] transition-colors lg:w-full ${
              activeSection === "summary"
                ? "bg-accent-soft font-semibold text-accent"
                : "text-slate-600 hover:bg-slate-50 hover:text-ink"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            Summary
          </button>

          {sections.map((section, index) => (
            <button
              type="button"
              key={section.id}
              onClick={() => onNavigate(section.id)}
              aria-current={activeSection === section.id ? "location" : undefined}
              aria-label={`${section.title}, ${Math.round(sectionProgressById.get(section.id) ?? 0)}% time remaining`}
              className={`flex shrink-0 flex-col items-stretch gap-1.5 rounded-md px-3 py-2.5 text-left text-[clamp(0.95rem,0.82rem+0.25vw,1.15rem)] transition-colors lg:w-full ${
                activeSection === section.id
                  ? "bg-accent-soft font-semibold text-accent"
                  : "text-slate-600 hover:bg-slate-50 hover:text-ink"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="w-5 shrink-0 font-mono text-[clamp(0.68rem,0.6rem+0.1vw,0.78rem)] text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0">{section.title}</span>
              </span>
              <span className="block h-1 w-full overflow-hidden rounded-full bg-slate-200/80" aria-hidden="true">
                <span
                  className="block h-full rounded-full bg-accent transition-[width] duration-700"
                  style={{ width: `${sectionProgressById.get(section.id) ?? 0}%` }}
                />
              </span>
            </button>
          ))}
        </div>
      </nav>

      <div className="px-7 pb-5 lg:absolute lg:inset-x-5 lg:bottom-0 lg:px-0 lg:pb-6">
        <div
          className="h-1 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label="Section time remaining"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sectionProgress)}
        >
          <span
            className="block h-full rounded-full bg-accent transition-[width] duration-700"
            style={{ width: `${sectionProgress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
