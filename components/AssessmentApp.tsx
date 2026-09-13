"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Section from "@/components/Section";
import Sidebar from "@/components/Sidebar";
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

  function navigateTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
    setActiveSection(id);
  }

  const activeSectionData = assessment.sections.find((section) => section.id === activeSection);
  const currentSection = activeSectionData?.title ?? assessment.sections[0]?.title ?? "—";

  return (
    <div className="min-h-screen bg-paper">
      <Header
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
          <div className="mx-auto w-full max-w-[1400px]">
            {assessment.sections.map((section) => (
              <Section key={section.id} section={section} registerSection={registerSection} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
