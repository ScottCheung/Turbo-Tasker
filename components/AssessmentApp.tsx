"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Section from "@/components/Section";
import Sidebar from "@/components/Sidebar";
import { formatDuration } from "@/components/Timer";
import { useSyncedSection } from "@/components/useSyncedSection";
import type { Assessment } from "@/types/assessment";

const TOTAL_DURATION_MS = 15 * 60 * 1000;
const STORAGE_KEYS = {
  assessmentStartedAt: "assessmentStartedAt",
  assessmentEndAt: "assessmentEndAt",
  mainAnswerStartedAt: "mainAnswerStartedAt",
  mainAnswerDuration: "mainAnswerDuration"
} as const;

function storedTimestamp(key: string) {
  const value = window.sessionStorage.getItem(key);
  if (!value) return null;

  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function clearTimerStorage() {
  Object.values(STORAGE_KEYS).forEach((key) => window.sessionStorage.removeItem(key));
}

export default function AssessmentApp({ assessment }: { assessment: Assessment }) {
  const [now, setNow] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [assessmentStartedAt, setAssessmentStartedAt] = useState<number | null>(null);
  const [assessmentEndAt, setAssessmentEndAt] = useState<number | null>(null);
  const [mainAnswerStartedAt, setMainAnswerStartedAt] = useState<number | null>(null);
  const [mainAnswerDuration, setMainAnswerDuration] = useState<number | null>(null);
  const { activeSection, setActiveSection, externalSection, clearExternalSection, syncReady } = useSyncedSection("summary");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const summaryRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const savedAssessmentStart = storedTimestamp(STORAGE_KEYS.assessmentStartedAt);
    const savedAssessmentEnd = storedTimestamp(STORAGE_KEYS.assessmentEndAt);
    const savedMainStart = storedTimestamp(STORAGE_KEYS.mainAnswerStartedAt);
    const savedMainDuration = storedTimestamp(STORAGE_KEYS.mainAnswerDuration);

    setAssessmentStartedAt(savedAssessmentStart);
    setAssessmentEndAt(savedAssessmentEnd);
    setMainAnswerStartedAt(savedMainStart);
    setMainAnswerDuration(savedMainDuration);
    setNow(Date.now());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [hydrated]);

  const assessmentStarted = assessmentStartedAt !== null && assessmentEndAt !== null;
  const mainAnswerStarted = mainAnswerStartedAt !== null && mainAnswerDuration !== null;
  const totalRemaining = assessmentEndAt === null ? TOTAL_DURATION_MS : Math.max(0, assessmentEndAt - now);

  const sectionProgressById = useMemo(() => {
    const progressById = new Map<string, number>();

    if (!mainAnswerStarted || mainAnswerStartedAt === null || mainAnswerDuration === null) {
      assessment.sections.forEach((section) => progressById.set(section.id, 100));
      return progressById;
    }

    const elapsed = Math.max(0, now - mainAnswerStartedAt);
    let sectionOffset = 0;

    assessment.sections.forEach((section) => {
      const duration = Math.round((mainAnswerDuration * section.timePercent) / 100);
      const rawRemaining = sectionOffset + duration - elapsed;
      const progress = duration > 0 ? Math.max(0, Math.min(100, (rawRemaining / duration) * 100)) : 0;

      progressById.set(section.id, progress);
      sectionOffset += duration;
    });

    return progressById;
  }, [assessment.sections, mainAnswerDuration, mainAnswerStarted, mainAnswerStartedAt, now]);

  const activeSectionProgress = sectionProgressById.get(activeSection) ?? 0;

  const registerSection = useCallback((id: string, element: HTMLElement | null) => {
    sectionRefs.current[id] = element;
  }, []);

  useEffect(() => {
    if (!syncReady || externalSection) return;

    const elements = [summaryRef.current, ...assessment.sections.map((section) => sectionRefs.current[section.id])].filter(
      (element): element is HTMLElement => element !== null
    );
    if (elements.length === 0) return;

    const updateCurrentSection = () => {
      // Use section start positions instead of intersection ratios. This keeps the
      // active item stable when a section is tall and guarantees the last item is
      // selected at the bottom of the document.
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

  function startAssessment() {
    const startedAt = Date.now();
    const endAt = startedAt + TOTAL_DURATION_MS;

    setAssessmentStartedAt(startedAt);
    setAssessmentEndAt(endAt);
    setMainAnswerStartedAt(null);
    setMainAnswerDuration(null);
    setNow(startedAt);
    window.sessionStorage.setItem(STORAGE_KEYS.assessmentStartedAt, String(startedAt));
    window.sessionStorage.setItem(STORAGE_KEYS.assessmentEndAt, String(endAt));
    window.sessionStorage.removeItem(STORAGE_KEYS.mainAnswerStartedAt);
    window.sessionStorage.removeItem(STORAGE_KEYS.mainAnswerDuration);
  }

  function startMainAnswer() {
    if (assessmentEndAt === null) return;

    const startedAt = Date.now();
    const duration = Math.max(0, assessmentEndAt - startedAt);
    if (duration <= 0) return;

    setMainAnswerStartedAt(startedAt);
    setMainAnswerDuration(duration);
    setNow(startedAt);
    window.sessionStorage.setItem(STORAGE_KEYS.mainAnswerStartedAt, String(startedAt));
    window.sessionStorage.setItem(STORAGE_KEYS.mainAnswerDuration, String(duration));
  }

  function resetAssessment() {
    clearTimerStorage();
    setAssessmentStartedAt(null);
    setAssessmentEndAt(null);
    setMainAnswerStartedAt(null);
    setMainAnswerDuration(null);
    setNow(0);
    setActiveSection("summary");
  }

  function start() {
    if (!assessmentStarted) {
      startAssessment();
      return;
    }

    startMainAnswer();
  }

  function navigateTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
    setActiveSection(id);
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header
        totalRemaining={totalRemaining}
        assessmentStarted={assessmentStarted}
        canStartMainAnswer={assessmentStarted && !mainAnswerStarted && totalRemaining > 0}
        onStart={start}
        onReset={resetAssessment}
      />

      <div className="mx-auto flex max-w-[1728px] flex-col overflow-x-clip lg:flex-row">
        <Sidebar
          sections={assessment.sections}
          activeSection={activeSection}
          sectionProgress={activeSectionProgress}
          sectionProgressById={sectionProgressById}
          onNavigate={navigateTo}
        />

        <main className="min-w-0 flex-1 overflow-x-clip px-5 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-[1400px]">
            <section
              id="summary"
              ref={summaryRef}
              className="flex min-h-[calc(100dvh-88px)] max-md:min-h-[calc(100dvh-136px)] snap-start scroll-mt-24 max-md:scroll-mt-36 flex-col justify-center py-10 lg:py-14"
              aria-labelledby="assessment-title"
            >
              <div className="flex flex-col justify-between gap-8 xl:flex-row xl:gap-16">
                <div className="min-w-0 flex-1">
                  <p className="mb-3 text-[clamp(0.78rem,0.65rem+0.2vw,0.95rem)] font-bold uppercase tracking-[0.22em] text-accent">
                    15-minute technical assessment
                  </p>
                  <h1
                    id="assessment-title"
                    className="text-[clamp(2.2rem,1.55rem+2vw,3.6rem)] font-semibold tracking-[-0.03em] text-ink"
                  >
                    {assessment.title}
                  </h1>
                  <p className="mt-3 text-[clamp(1rem,0.84rem+0.35vw,1.25rem)] font-medium text-muted">{assessment.taskType}</p>

                  <div className="mt-8">
                    <p className="mb-3 text-[clamp(0.72rem,0.62rem+0.15vw,0.86rem)] font-bold uppercase tracking-[0.2em] text-muted">
                      Summary
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-3 sm:gap-4">
                      {assessment.summary.map((item) => (
                        <li
                          key={item}
                          className="border-l-2 border-accent pl-3 text-[clamp(1rem,0.84rem+0.35vw,1.25rem)] leading-[1.6] text-ink"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="w-full shrink-0 pt-4 text-[clamp(1rem,0.84rem+0.35vw,1.25rem)] xl:mt-1 xl:w-52 xl:pl-6 xl:pt-0">
                  <p className="text-[clamp(0.72rem,0.62rem+0.15vw,0.86rem)] font-bold uppercase tracking-[0.2em] text-muted">Session</p>
                  <p className="mt-2 font-semibold text-ink">
                    {!assessmentStarted ? "Ready to begin" : mainAnswerStarted ? "Main answer running" : "Summary phase"}
                  </p>
                  <p className="mt-2 leading-[1.6] text-slate-500">
                    {!assessmentStarted
                      ? "Start the global timer when you receive the go-ahead."
                      : mainAnswerStarted
                        ? `Main answer started with ${formatDuration(mainAnswerDuration ?? 0)} remaining.`
                        : "Use the summary phase to form your approach, then start the main answer timeline."}
                  </p>
                </div>
              </div>
            </section>

            <div>
              {assessment.sections.map((section) => {
                return (
                  <Section
                    key={section.id}
                    section={section}
                    registerSection={registerSection}
                  />
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
