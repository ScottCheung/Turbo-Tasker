import fs from "node:fs";
import path from "node:path";

const TASK_PATH = path.join(process.cwd(), "input", "TASK.md");

export function loadTask(): string {
  try {
    return fs.readFileSync(TASK_PATH, "utf8");
  } catch {
    throw new Error("Unable to read the original task from input/TASK.md.");
  }
}
