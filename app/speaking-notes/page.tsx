import SpeakingNotesApp from "@/components/SpeakingNotesApp";
import { loadAssessment } from "@/data/loadAssessment";
import type { Assessment } from "@/types/assessment";

export const dynamic = "force-dynamic";

export default function SpeakingNotesPage() {
  const assessment = loadAssessment();
  const cleanAssessment: Assessment = {
    ...assessment,
    sections: assessment.sections.map((section) => ({
      ...section,
      points: Array.from(new Set(section.points))
    }))
  };

  return <SpeakingNotesApp assessment={cleanAssessment} />;
}
