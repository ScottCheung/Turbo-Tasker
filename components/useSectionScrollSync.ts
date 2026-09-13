"use client";

import { useCallback, useEffect, useRef, type MutableRefObject } from "react";

type Section = {
  id: string;
};

type UseSectionScrollSyncOptions = {
  sections: readonly Section[];
  sectionRefs: MutableRefObject<Record<string, HTMLElement | null>>;
  setActiveSection: (id: string) => void;
  externalSection: string | null;
  clearExternalSection: () => void;
  syncReady: boolean;
};

const HEADER_OFFSET = 112;
const ACTIVE_MARKER_RATIO = 0.35;
const MAX_ACTIVE_MARKER = 320;
const NAVIGATION_TIMEOUT_MS = 2000;

export function useSectionScrollSync({
  sections,
  sectionRefs,
  setActiveSection,
  externalSection,
  clearExternalSection,
  syncReady
}: UseSectionScrollSyncOptions) {
  const updateCurrentSectionRef = useRef<(() => void) | null>(null);
  const frameRef = useRef<number | null>(null);
  const navigationTargetRef = useRef<string | null>(null);
  const navigationCheckTimerRef = useRef<number | null>(null);

  const scheduleUpdate = useCallback(() => {
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      updateCurrentSectionRef.current?.();
    });
  }, []);

  const isNavigationComplete = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return true;

    const scrollPaddingTop = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const scrollMarginTop = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
    const absoluteTop = element.getBoundingClientRect().top + window.scrollY;
    const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetScrollY = Math.min(maxScrollY, Math.max(0, absoluteTop - scrollPaddingTop - scrollMarginTop));

    return Math.abs(window.scrollY - targetScrollY) <= 3;
  }, []);

  const startNavigation = useCallback(
    (id: string) => {
      navigationTargetRef.current = id;

      if (navigationCheckTimerRef.current !== null) {
        window.clearTimeout(navigationCheckTimerRef.current);
      }

      const startedAt = Date.now();
      const checkNavigation = () => {
        if (navigationTargetRef.current !== id) return;

        const timedOut = Date.now() - startedAt >= NAVIGATION_TIMEOUT_MS;
        if (isNavigationComplete(id) || timedOut) {
          navigationTargetRef.current = null;
          navigationCheckTimerRef.current = null;
          clearExternalSection();
          scheduleUpdate();
          return;
        }

        navigationCheckTimerRef.current = window.setTimeout(checkNavigation, 50);
      };

      checkNavigation();
    }, [clearExternalSection, isNavigationComplete, scheduleUpdate]
  );

  useEffect(() => {
    if (!syncReady) return;

    const updateCurrentSection = () => {
      const navigationTarget = navigationTargetRef.current;
      if (navigationTarget) {
        if (!isNavigationComplete(navigationTarget)) return;
        navigationTargetRef.current = null;
        if (navigationCheckTimerRef.current !== null) {
          window.clearTimeout(navigationCheckTimerRef.current);
        }
        navigationCheckTimerRef.current = null;
        clearExternalSection();
      }

      const elements = sections
        .map((section) => sectionRefs.current[section.id])
        .filter((element): element is HTMLElement => element !== null);
      if (elements.length === 0) return;

      const marker = Math.max(HEADER_OFFSET, Math.min(MAX_ACTIVE_MARKER, window.innerHeight * ACTIVE_MARKER_RATIO));
      let currentId = elements[0].id;

      elements.forEach((element) => {
        if (element.getBoundingClientRect().top <= marker) currentId = element.id;
      });

      const atDocumentEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atDocumentEnd) currentId = elements[elements.length - 1].id;

      setActiveSection(currentId);
    };

    updateCurrentSectionRef.current = updateCurrentSection;

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    scheduleUpdate();

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("pageshow", scheduleUpdate);
      updateCurrentSectionRef.current = null;

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (navigationCheckTimerRef.current !== null) {
        window.clearTimeout(navigationCheckTimerRef.current);
        navigationCheckTimerRef.current = null;
      }
      navigationTargetRef.current = null;
    };
  }, [clearExternalSection, isNavigationComplete, scheduleUpdate, sections, sectionRefs, setActiveSection, syncReady]);

  useEffect(() => {
    if (!externalSection) return;

    const element = document.getElementById(externalSection);
    if (!element) {
      clearExternalSection();
      return;
    }

    startNavigation(externalSection);
    element.scrollIntoView({ behavior: "auto", block: "start" });
  }, [externalSection, startNavigation]);

  return useCallback(
    (id: string) => {
      const element = document.getElementById(id);
      if (!element) return;

      startNavigation(id);
      element.scrollIntoView({ behavior: "auto", block: "start" });
      setActiveSection(id);
    },
    [setActiveSection, startNavigation]
  );
}
