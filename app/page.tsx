import AssessmentApp from "@/components/AssessmentApp";
import assessment from "@/data/assessment.json";
import type { Assessment } from "@/types/assessment";

export default function HomePage() {
  return <AssessmentApp assessment={assessment as Assessment} />;
}
