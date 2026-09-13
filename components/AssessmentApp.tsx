"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Section from "@/components/Section";
import Sidebar from "@/components/Sidebar";
import { useSectionScrollSync } from "@/components/useSectionScrollSync";
import { useSyncedSection } from "@/components/useSyncedSection";
import type { Assessment } from "@/types/assessment";

const TOTAL_DURATION_MS = 15 * 60 * 1000;
const STORAGE_KEY = "assessmentEndAt";

function storedTimestamp() {
  const value = window.sessionStorage.getItem(STORAGE_KEY);
  if (!value) return null;

  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export default function AssessmentApp({ assessment }: { assessment: Assessment }) {
  const firstSectionId = assessment.sections[0]?.id ?? "understanding";
  const { activeSection, setActiveSection, externalSection, clearExternalSection, syncReady } = useSyncedSection(firstSectionId);
  const [now, setNow] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [assessmentEndAt, setAssessmentEndAt] = useState<number | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const savedAssessmentEnd = storedTimestamp();
    setAssessmentEndAt(savedAssessmentEnd);
    setNow(Date.now());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [hydrated]);

  const assessmentStarted = assessmentEndAt !== null;
  const totalRemaining = assessmentEndAt === null ? TOTAL_DURATION_MS : Math.max(0, assessmentEndAt - now);

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

  function startAssessment() {
    const endAt = Date.now() + TOTAL_DURATION_MS;
    setAssessmentEndAt(endAt);
    setNow(Date.now());
    window.sessionStorage.setItem(STORAGE_KEY, String(endAt));
  }

  function resetAssessment() {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setAssessmentEndAt(null);
    setNow(Date.now());
    setActiveSection(firstSectionId);
  }

  const activeSectionData = assessment.sections.find((section) => section.id === activeSection);
  const currentSection = activeSectionData?.title ?? assessment.sections[0]?.title ?? "—";

  return (
    <div className="min-h-screen bg-paper">
      <Header
        title={assessment.title}
        taskType={assessment.taskType}
        currentSection={currentSection}
        totalRemaining={totalRemaining}
        assessmentStarted={assessmentStarted}
        onStart={startAssessment}
        onReset={resetAssessment}
      />

      <div className="mx-auto flex max-w-[1728px] flex-col overflow-x-clip lg:flex-row">
        <Sidebar sections={assessment.sections} activeSection={activeSection} onNavigate={navigateTo} />

        <main className="min-w-0 flex-1 overflow-x-clip px-5 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-[1040px]">
            {assessment.sections.map((section) => (
              <Section key={section.id} section={section} registerSection={registerSection} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
