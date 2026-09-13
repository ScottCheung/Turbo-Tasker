"use client";

import { useCallback, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { useSyncedSection } from "@/components/useSyncedSection";
import type { Assessment } from "@/types/assessment";

export default function SpeakingNotesApp({ assessment }: { assessment: Assessment }) {
  const firstSectionId = assessment.sections[0]?.id ?? "understanding";
  const { activeSection, setActiveSection, externalSection, clearExternalSection, syncReady } = useSyncedSection(firstSectionId);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const registerSection = useCallback((id: string, element: HTMLElement | null) => {
    sectionRefs.current[id] = element;
  }, []);

  useEffect(() => {
    if (!syncReady || externalSection) return;

    const elements = assessment.sections
      .map((section) => sectionRefs.current[section.id])
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const updateCurrentSection = () => {
      const marker = window.scrollY + 112;
      let currentId = elements[0].id;

      elements.forEach((element) => {
        const top = element.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) currentId = element.id;
      });

      const atDocumentEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atDocumentEnd) currentId = elements[elements.length - 1].id;

      setActiveSection(currentId);
    };

    window.addEventListener("scroll", updateCurrentSection, { passive: true });
    window.addEventListener("resize", updateCurrentSection);
    updateCurrentSection();

    return () => {
      window.removeEventListener("scroll", updateCurrentSection);
      window.removeEventListener("resize", updateCurrentSection);
    };
  }, [assessment.sections, externalSection, setActiveSection, syncReady]);

  useEffect(() => {
    if (!externalSection) return;

    document.getElementById(externalSection)?.scrollIntoView({ behavior: "auto", block: "start" });
    clearExternalSection();
  }, [clearExternalSection, externalSection]);

  function navigateTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
    setActiveSection(id);
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-[72px] max-w-[1728px] items-center justify-between gap-5 px-5 py-3 lg:px-8">
          <div className="min-w-0">
            <a
              href="/"
              className="block truncate text-[clamp(0.82rem,0.7rem+0.2vw,1rem)] font-bold uppercase tracking-[0.22em] text-accent"
            >
              Assessment Copilot
            </a>
            <p className="mt-1 text-[clamp(0.7rem,0.6rem+0.15vw,0.86rem)] font-medium uppercase tracking-[0.18em] text-muted">
              Speaking notes
            </p>
          </div>

          <a
            href="/"
            className="shrink-0 rounded-md px-3 py-2 text-[clamp(0.78rem,0.7rem+0.15vw,0.95rem)] font-semibold text-accent transition-colors hover:bg-accent-soft"
          >
            Main assessment
          </a>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1728px] flex-col overflow-x-clip lg:flex-row">
        <Sidebar sections={assessment.sections} activeSection={activeSection} onNavigate={navigateTo} />

        <main className="min-w-0 flex-1 overflow-x-clip px-5 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-[1400px]">
            {assessment.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                ref={(element) => registerSection(section.id, element)}
                className="flex min-h-[calc(100dvh-88px)] max-md:min-h-[calc(100dvh-136px)] scroll-mt-24 max-md:scroll-mt-36 flex-col justify-center overflow-x-clip py-12 lg:py-16"
                aria-labelledby={`${section.id}-notes-title`}
              >
                <p className="mb-3 text-[clamp(0.72rem,0.62rem+0.15vw,0.86rem)] font-bold uppercase tracking-[0.2em] text-accent">
                  Speaking notes
                </p>
                <h2
                  id={`${section.id}-notes-title`}
                  className="text-[clamp(1.9rem,1.35rem+1.35vw,2.85rem)] font-semibold tracking-[-0.025em] text-ink"
                >
                  {section.title}
                </h2>

                <ul className="mt-[clamp(2.25rem,6vh,4.5rem)] grid gap-x-12 gap-y-7 sm:grid-cols-2">
                  {section.speakingNotes.map((note, noteIndex) => (
                    <li
                      key={note}
                      className="flex gap-4 border-l-2 border-accent pl-4 text-[clamp(1.06rem,0.9rem+0.4vw,1.35rem)] leading-[1.65] text-ink"
                    >
                      <span className="shrink-0 font-mono text-[clamp(0.7rem,0.62rem+0.12vw,0.84rem)] font-semibold text-accent">
                        {String(noteIndex + 1).padStart(2, "0")}
                      </span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
