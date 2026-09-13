"use client";

import { useEffect, useMemo, useState } from "react";
import type { AssessmentSection } from "@/types/assessment";
import MermaidDiagram from "@/components/MermaidDiagram";

type SectionProps = {
  section: AssessmentSection;
  registerSection: (id: string, element: HTMLElement | null) => void;
};

type SectionPage = {
  points: string[];
  diagram: string;
};

const DEFAULT_POINTS_PER_PAGE = 8;

function splitIntoPages(points: string[], pointsPerPage: number): string[][] {
  const pages: string[][] = [];

  for (let index = 0; index < points.length; index += pointsPerPage) {
    pages.push(points.slice(index, index + pointsPerPage));
  }

  return pages.length > 0 ? pages : [[]];
}

export default function Section({
  section,
  registerSection
}: SectionProps) {
  const [compactViewport, setCompactViewport] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setCompactViewport(window.innerWidth < 1024 || window.innerHeight < 760);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const pages = useMemo<SectionPage[]>(() => {
    const pointsPerPage = compactViewport ? 6 : DEFAULT_POINTS_PER_PAGE;
    const pointPages = splitIntoPages(section.points, pointsPerPage);

    if (section.diagram && compactViewport && pointPages.length === 1) {
      return [
        { points: pointPages[0], diagram: "" },
        { points: [], diagram: section.diagram }
      ];
    }

    return pointPages.map((points, index) => ({
      points,
      diagram: index === pointPages.length - 1 ? section.diagram : ""
    }));
  }, [compactViewport, section.diagram, section.points]);

  return (
    <section
      id={section.id}
      ref={(element) => registerSection(section.id, element)}
      className="scroll-mt-24 max-md:scroll-mt-36"
      aria-labelledby={`${section.id}-title-1`}
    >
      {pages.map((page, pageIndex) => (
        <div
          key={`${section.id}-page-${pageIndex + 1}`}
          className="flex min-h-[calc(100dvh-88px)] max-md:min-h-[calc(100dvh-136px)] snap-start flex-col justify-center overflow-x-clip py-10 lg:py-14"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h2
                id={`${section.id}-title-${pageIndex + 1}`}
                className="text-[clamp(1.75rem,1.2rem+1.25vw,2.7rem)] font-semibold tracking-[-0.02em] text-ink"
              >
                {section.title}
                {pages.length > 1 ? ` (${pageIndex + 1}/${pages.length})` : null}
              </h2>
            </div>
          </div>

          <div
            className={`mt-[clamp(2.5rem,7vh,5.5rem)] w-full ${
              page.diagram
                ? "grid items-center gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12"
                : "max-w-none"
            }`}
          >
            {page.points.length > 0 ? (
              <ul className={`grid gap-x-12 gap-y-6 ${page.diagram ? "sm:grid-cols-2 lg:grid-cols-1" : "sm:grid-cols-2"}`}>
                {page.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-[clamp(1.08rem,0.9rem+0.4vw,1.4rem)] leading-[1.7] text-ink"
                  >
                    <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {page.diagram ? (
              <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
                <p className="mb-4 text-[clamp(0.72rem,0.62rem+0.15vw,0.86rem)] font-bold uppercase tracking-[0.2em] text-muted">
                Architecture diagram
                </p>
                <MermaidDiagram chart={page.diagram} />
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  );
}
