"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { AssessmentSection } from "@/types/assessment";

type SidebarProps = {
  sections: AssessmentSection[];
  activeSection: string;
  onNavigate?: (id: string) => void;
  activeView?: "assessment" | "task";
};

export default function Sidebar({ sections, activeSection, onNavigate, activeView = "assessment" }: SidebarProps) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const navRef = useRef<HTMLElement | null>(null);
  const sectionListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeButton = buttonRefs.current[activeSection];
    const nav = navRef.current;
    const sectionList = sectionListRef.current;
    if (!activeButton || !nav || !sectionList) return;

    const buttonRect = activeButton.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const listRect = sectionList.getBoundingClientRect();
    const edgePadding = 8;

    if (nav.scrollHeight > nav.clientHeight) {
      if (buttonRect.top < navRect.top + edgePadding) {
        nav.scrollBy({ top: buttonRect.top - navRect.top - edgePadding, behavior: "smooth" });
      } else if (buttonRect.bottom > navRect.bottom - edgePadding) {
        nav.scrollBy({ top: buttonRect.bottom - navRect.bottom + edgePadding, behavior: "smooth" });
      }
    }

    if (sectionList.scrollWidth > sectionList.clientWidth) {
      if (buttonRect.left < listRect.left + edgePadding) {
        sectionList.scrollBy({ left: buttonRect.left - listRect.left - edgePadding, behavior: "smooth" });
      } else if (buttonRect.right > listRect.right - edgePadding) {
        sectionList.scrollBy({ left: buttonRect.right - listRect.right + edgePadding, behavior: "smooth" });
      }
    }
  }, [activeSection]);

  function navigateToSection(id: string) {
    if (activeView === "task") {
      window.location.href = `/#${id}`;
      return;
    }

    onNavigate?.(id);
  }

  return (
    <aside className="relative border-b border-line bg-white lg:sticky lg:top-[73px] lg:h-[calc(100dvh-73px)] lg:w-[248px] lg:shrink-0 lg:border-b-0 lg:border-r">
      <nav ref={navRef} className="px-2 py-5 lg:h-full lg:overflow-y-auto lg:px-5 lg:py-8" aria-label="Assessment sections">
        <p className="mb-4 px-3 text-[clamp(0.7rem,0.6rem+0.15vw,0.85rem)] font-bold uppercase tracking-[0.2em] text-muted">
          Assessment
        </p>
        <Link
          href="/task"
          aria-current={activeView === "task" ? "page" : undefined}
          className={`mb-4 flex items-center gap-3 rounded-md px-3 py-3 text-left text-[clamp(0.95rem,0.82rem+0.25vw,1.15rem)] transition-colors lg:w-full ${
            activeView === "task"
              ? "bg-accent-soft font-semibold text-accent"
              : "text-slate-600 hover:bg-slate-50 hover:text-ink"
          }`}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
          <span>Original task</span>
        </Link>
        <p className="mb-2 px-3 text-[clamp(0.64rem,0.56rem+0.12vw,0.76rem)] font-bold uppercase tracking-[0.16em] text-muted">
          Solution outline
        </p>
        <div ref={sectionListRef} className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
          {sections.map((section) => (
            <button
              type="button"
              key={section.id}
              ref={(element) => {
                buttonRefs.current[section.id] = element;
              }}
              onClick={() => navigateToSection(section.id)}
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
