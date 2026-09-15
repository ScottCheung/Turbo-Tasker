"use client";

import { useCallback, useRef } from "react";
import { useSectionScrollSync } from "@/components/useSectionScrollSync";
import { useSyncedSection } from "@/components/useSyncedSection";
import type { Assessment } from "@/types/assessment";

function splitSpeakingNote(note: string) {
  const separatorMatch = /\s*[｜|]\s*/.exec(note);

  if (!separatorMatch) {
    return { chinese: note, english: "" };
  }

  const separatorIndex = separatorMatch.index;

  return {
    chinese: note.slice(0, separatorIndex).trim(),
    english: note.slice(separatorIndex + separatorMatch[0].length).trim()
  };
}

export default function SpeakingNotesApp({ assessment }: { assessment: Assessment }) {
  const firstSectionId = assessment.sections[0]?.id ?? "understanding";
  const { activeSection, setActiveSection, externalSection, clearExternalSection, syncReady } = useSyncedSection(firstSectionId);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const registerSection = useCallback((id: string, element: HTMLElement | null) => {
    sectionRefs.current[id] = element;
  }, []);

  const navigateTo = useSectionScrollSync({
    sections: assessment.sections,
    sectionRefs,
    setActiveSection,
    externalSection,
    clearExternalSection,
    syncReady
  });

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

      <main className="min-w-0 overflow-x-clip px-5 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-[860px]">
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

              <ul className="mt-[clamp(2.25rem,6vh,4.5rem)] grid max-w-[980px] gap-y-8">
                {section.speakingNotes.map((note, noteIndex, notes) => {
                  const isFirst = noteIndex === 0;
                  const isLast = noteIndex === notes.length - 1;
                  const label = isFirst ? "Start here" : isLast ? "Transition" : "Explain";
                  const { chinese, english } = splitSpeakingNote(note);

                  return (
                    <li
                      key={note}
                      className={
                        isFirst
                          ? "rounded-lg bg-accent-soft p-5 text-ink"
                          : "border-l-2 border-accent pl-4 text-ink"
                      }
                    >
                      <div className="mb-2 flex items-center gap-3 text-[clamp(0.7rem,0.62rem+0.12vw,0.84rem)] font-bold uppercase tracking-[0.16em] text-accent">
                        <span className="font-mono">{String(noteIndex + 1).padStart(2, "0")}</span>
                        <span>{label}</span>
                      </div>
                      <div className="grid gap-2.5">
                        <p className="text-[clamp(1.12rem,0.98rem+0.4vw,1.42rem)] leading-[1.6] text-ink">
                          {chinese}
                        </p>
                        {english ? (
                          <p className="text-[clamp(1rem,0.9rem+0.32vw,1.24rem)] leading-[1.55] text-muted">
                            {english}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
