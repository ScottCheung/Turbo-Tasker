import type { AssessmentSection } from "@/types/assessment";

type SidebarProps = {
  sections: AssessmentSection[];
  activeSection: string;
  onNavigate: (id: string) => void;
};

export default function Sidebar({ sections, activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="relative border-b border-line bg-white lg:sticky lg:top-[73px] lg:h-[calc(100dvh-73px)] lg:w-[248px] lg:shrink-0 lg:border-b-0 lg:border-r">
      <nav className="px-2 py-5 lg:h-full lg:overflow-y-auto lg:px-5 lg:py-8" aria-label="Assessment sections">
        <p className="mb-4 px-3 text-[clamp(0.7rem,0.6rem+0.15vw,0.85rem)] font-bold uppercase tracking-[0.2em] text-muted">
          Sections
        </p>
        <div className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
          {sections.map((section) => (
            <button
              type="button"
              key={section.id}
              onClick={() => onNavigate(section.id)}
              aria-current={activeSection === section.id ? "location" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-3 text-left text-[clamp(0.95rem,0.82rem+0.25vw,1.15rem)] transition-colors lg:w-full ${
                activeSection === section.id
                  ? "bg-accent-soft font-semibold text-accent"
                  : "text-slate-600 hover:bg-slate-50 hover:text-ink"
              }`}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
              <span>{section.title}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
