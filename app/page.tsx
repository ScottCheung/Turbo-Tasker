import AssessmentApp from "@/components/AssessmentApp";
import assessment from "@/data/assessment.json";
import type { Assessment } from "@/types/assessment";

export default function HomePage() {
  const cleanAssessment: Assessment = {
    ...(assessment as Assessment),
    sections: (assessment as Assessment).sections.map((section) => ({
      ...section,
      points: Array.from(new Set(section.points))
    }))
  };

  return <AssessmentApp assessment={cleanAssessment} />;
}
