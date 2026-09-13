import SpeakingNotesApp from "@/components/SpeakingNotesApp";
import assessment from "@/data/assessment.json";
import type { Assessment } from "@/types/assessment";

export default function SpeakingNotesPage() {
  const cleanAssessment: Assessment = {
    ...(assessment as Assessment),
    sections: (assessment as Assessment).sections.map((section) => ({
      ...section,
      points: Array.from(new Set(section.points))
    }))
  };

  return <SpeakingNotesApp assessment={cleanAssessment} />;
}
