import AssessmentApp from "@/components/AssessmentApp";
import { loadAssessment } from "@/data/loadAssessment";
import type { Assessment } from "@/types/assessment";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const assessment = loadAssessment();
  const cleanAssessment: Assessment = {
    ...assessment,
    sections: assessment.sections.map((section) => ({
      ...section,
      points: Array.from(new Set(section.points))
    }))
  };

  return <AssessmentApp assessment={cleanAssessment} />;
}
