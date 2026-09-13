"use client";

import { useEffect, useId, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
};

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const reactId = useId();
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        themeVariables: {
          primaryColor: "#e8f2fa",
          primaryTextColor: "#17212b",
          primaryBorderColor: "#7ba9c8",
          lineColor: "#55758d",
          secondaryColor: "#f7f9fb",
          tertiaryColor: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif"
        }
      });

      const { svg: renderedSvg } = await mermaid.render(
        `assessment-diagram-${reactId.replace(/:/g, "")}`,
        chart
      );

      if (!cancelled) {
        setSvg(renderedSvg);
      }
    }

    renderDiagram().catch(() => {
      if (!cancelled) {
        setSvg("");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (!svg) {
    return <div className="h-24 animate-pulse rounded-md bg-slate-100" aria-label="Loading diagram" />;
  }

  return <div className="mermaid overflow-x-clip" dangerouslySetInnerHTML={{ __html: svg }} />;
}
