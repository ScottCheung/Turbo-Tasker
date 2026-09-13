"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "assessment-copilot-active-section";
const CHANNEL_NAME = "assessment-copilot-section-sync";

type SectionMessage = {
  type: "active-section";
  id: string;
};

export function useSyncedSection(initialSection: string) {
  const [activeSection, setActiveSectionState] = useState(initialSection);
  const [externalSection, setExternalSection] = useState<string | null>(null);
  const [syncReady, setSyncReady] = useState(false);
  const activeSectionRef = useRef(initialSection);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    try {
      const savedSection = window.localStorage.getItem(STORAGE_KEY);
      if (savedSection) {
        activeSectionRef.current = savedSection;
        setActiveSectionState(savedSection);
        setExternalSection(savedSection);
      }
    } catch {
      // Local storage can be unavailable in a restricted browser context.
    }

    const receiveSection = (id: string) => {
      activeSectionRef.current = id;
      setActiveSectionState(id);
      setExternalSection(id);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        receiveSection(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);

    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = channel;
      channel.addEventListener("message", (event: MessageEvent<SectionMessage>) => {
        if (event.data?.type === "active-section" && event.data.id) {
          receiveSection(event.data.id);
        }
      });
    }

    setSyncReady(true);

    return () => {
      window.removeEventListener("storage", handleStorage);
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, []);

  const setActiveSection = useCallback((id: string) => {
    if (activeSectionRef.current === id) {
      setExternalSection(null);
      return;
    }

    activeSectionRef.current = id;
    setActiveSectionState(id);
    setExternalSection(null);

    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Continue with BroadcastChannel when local storage is unavailable.
    }

    const message: SectionMessage = { type: "active-section", id };
    channelRef.current?.postMessage(message);
  }, []);

  const clearExternalSection = useCallback(() => {
    setExternalSection(null);
  }, []);

  return {
    activeSection,
    setActiveSection,
    externalSection,
    clearExternalSection,
    syncReady
  };
}
