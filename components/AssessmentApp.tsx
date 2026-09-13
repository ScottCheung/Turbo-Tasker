"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Section from "@/components/Section";
import Sidebar from "@/components/Sidebar";
import { formatDuration } from "@/components/Timer";
import type { Assessment } from "@/types/assessment";

const TOTAL_DURATION_MS = 15 * 60 * 1000;
const STORAGE_KEYS = {
  assessmentStartedAt: "assessmentStartedAt",
  assessmentEndAt: "assessmentEndAt",
  mainAnswerStartedAt: "mainAnswerStartedAt",
  mainAnswerDuration: "mainAnswerDuration"
} as const;

type SectionTiming = {
  remaining: number;
  over: boolean;
};

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
  const [activeSection, setActiveSection] = useState("summary");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const summaryRef = useRef<HTMLElement | null>(null);
  const navigationTarget = useRef<{ id: string; token: number } | null>(null);

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

  const sectionTimings = useMemo(() => {
    const timings = new Map<string, SectionTiming>();
    if (!mainAnswerStarted || mainAnswerStartedAt === null || mainAnswerDuration === null) {
      return timings;
    }

    const elapsed = Math.max(0, now - mainAnswerStartedAt);
    let sectionOffset = 0;

    assessment.sections.forEach((section) => {
      const duration = Math.round((mainAnswerDuration * section.timePercent) / 100);
      const rawRemaining = elapsed < sectionOffset ? duration : sectionOffset + duration - elapsed;
      timings.set(section.id, {
        remaining: Math.abs(rawRemaining),
        over: rawRemaining < 0
      });
      sectionOffset += duration;
    });

    return timings;
  }, [assessment.sections, mainAnswerDuration, mainAnswerStarted, mainAnswerStartedAt, now]);

  const activeTitle =
    activeSection === "summary"
      ? "Summary"
      : assessment.sections.find((section) => section.id === activeSection)?.title ?? "Summary";
  const activeTiming = sectionTimings.get(activeSection);

  const registerSection = useCallback((id: string, element: HTMLElement | null) => {
    sectionRefs.current[id] = element;
  }, []);

  useEffect(() => {
    const elements = [summaryRef.current, ...assessment.sections.map((section) => sectionRefs.current[section.id])].filter(
      (element): element is HTMLElement => element !== null
    );
    if (elements.length === 0) return;

    const updateCurrentSection = () => {
      if (navigationTarget.current) return;

      const marker = Math.min(280, window.innerHeight * 0.35);
      const current = elements
        .map((element) => ({
          id: element.id,
          top: element.getBoundingClientRect().top,
          bottom: element.getBoundingClientRect().bottom
        }))
        .filter(({ top, bottom }) => top <= marker && bottom > 90)
        .sort((a, b) => b.top - a.top)[0];

      if (current) setActiveSection(current.id);
    };

    const observer = new IntersectionObserver(updateCurrentSection, {
      rootMargin: "-14% 0px -66% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    elements.forEach((element) => observer.observe(element));
    window.addEventListener("scroll", updateCurrentSection, { passive: true });
    updateCurrentSection();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateCurrentSection);
    };
  }, [assessment.sections]);

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

  function navigateTo(id: string) {
    const token = Date.now();
    navigationTarget.current = { id, token };
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
    window.setTimeout(() => {
      if (navigationTarget.current?.token === token) {
        navigationTarget.current = null;
        setActiveSection(id);
      }
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header
        totalRemaining={totalRemaining}
        currentTitle={activeTitle}
        sectionRemaining={activeTiming?.remaining ?? null}
        sectionOver={activeTiming?.over ?? false}
        assessmentStarted={assessmentStarted}
        mainAnswerStarted={mainAnswerStarted}
        canStartMainAnswer={assessmentStarted && !mainAnswerStarted && totalRemaining > 0}
        onStartAssessment={startAssessment}
        onStartMainAnswer={startMainAnswer}
        onReset={resetAssessment}
      />

      <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
        <Sidebar sections={assessment.sections} activeSection={activeSection} onNavigate={navigateTo} />

        <main className="min-w-0 flex-1 px-5 pb-24 lg:px-12 xl:px-16">
          <section
            id="summary"
            ref={summaryRef}
            className="scroll-mt-24 border-b border-line py-10 lg:py-14"
            aria-labelledby="assessment-title"
          >
            <div className="flex flex-col justify-between gap-8 xl:flex-row xl:gap-16">
              <div className="max-w-3xl">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-accent">15-minute technical assessment</p>
                <h1 id="assessment-title" className="text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
                  {assessment.title}
                </h1>
                <p className="mt-3 text-sm font-medium text-muted">{assessment.taskType}</p>

                <div className="mt-8">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Summary</p>
                  <ul className="grid gap-2 sm:grid-cols-3 sm:gap-4">
                    {assessment.summary.map((item) => (
                      <li key={item} className="border-l-2 border-accent pl-3 text-sm leading-6 text-ink">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="w-full shrink-0 border-t border-line pt-4 text-sm xl:mt-1 xl:w-52 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Session</p>
                <p className="mt-2 font-semibold text-ink">
                  {!assessmentStarted ? "Ready to begin" : mainAnswerStarted ? "Main answer running" : "Summary phase"}
                </p>
                <p className="mt-2 leading-6 text-slate-500">
                  {!assessmentStarted
                    ? "Start the global timer when you receive the go-ahead."
                    : mainAnswerStarted
                      ? `Main answer started with ${formatDuration(mainAnswerDuration ?? 0)} remaining.`
                      : "Use the summary phase to form your approach, then start the main answer timeline."}
                </p>
              </div>
            </div>
          </section>

          <div className="max-w-5xl">
            {assessment.sections.map((section) => {
              const timing = sectionTimings.get(section.id);
              return (
                <Section
                  key={section.id}
                  section={section}
                  sectionRemaining={timing?.remaining ?? null}
                  sectionOver={timing?.over ?? false}
                  registerSection={registerSection}
                />
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
