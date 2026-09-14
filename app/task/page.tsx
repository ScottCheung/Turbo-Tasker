import TaskApp from "@/components/TaskApp";
import { loadAssessment } from "@/data/loadAssessment";
import { loadTask } from "@/data/loadTask";

export const dynamic = "force-dynamic";

export default function TaskPage() {
  return <TaskApp task={loadTask()} assessment={loadAssessment()} />;
}
