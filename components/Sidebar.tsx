import type { AssessmentSection } from "@/types/assessment";

type SidebarProps = {
  sections: AssessmentSection[];
  activeSection: string;
  onNavigate: (id: string) => void;
};

export default function Sidebar({ sections, activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="border-b border-line bg-white lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:w-[248px] lg:shrink-0 lg:border-b-0 lg:border-r">
      <nav className="px-4 py-5 lg:h-full lg:overflow-y-auto lg:px-5 lg:py-8" aria-label="Assessment sections">
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">On this page</p>
        <div className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
          <button
            type="button"
            onClick={() => onNavigate("summary")}
            className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors lg:w-full ${
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
              className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors lg:w-full ${
                activeSection === section.id
                  ? "bg-accent-soft font-semibold text-accent"
                  : "text-slate-600 hover:bg-slate-50 hover:text-ink"
              }`}
            >
              <span className="w-5 font-mono text-[10px] text-slate-400">{String(index + 1).padStart(2, "0")}</span>
              <span>{section.title}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
