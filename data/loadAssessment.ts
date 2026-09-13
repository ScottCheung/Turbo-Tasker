import fs from "node:fs";
import path from "node:path";
import type { Assessment } from "@/types/assessment";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const RESULT_PATH = path.join(DATA_DIRECTORY, "result.json");
const FALLBACK_PATH = path.join(DATA_DIRECTORY, "assessment.json");
const SECTION_IDS = ["understanding", "approach", "core-solution", "verification", "wrap-up"];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isAssessment(value: unknown): value is Assessment {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Assessment>;
  if (typeof candidate.title !== "string" || typeof candidate.taskType !== "string") return false;
  if (!isStringArray(candidate.summary) || !Array.isArray(candidate.sections)) return false;
  if (candidate.sections.length !== SECTION_IDS.length) return false;

  return candidate.sections.every((section, index) => {
    if (!section || typeof section !== "object") return false;

    const candidateSection = section as Partial<Assessment["sections"][number]>;
    return (
      candidateSection.id === SECTION_IDS[index] &&
      typeof candidateSection.title === "string" &&
      isStringArray(candidateSection.points) &&
      isStringArray(candidateSection.speakingNotes) &&
      typeof candidateSection.visual === "string"
    );
  });
}

function readAssessment(filePath: string): Assessment | null {
  try {
    const contents = fs.readFileSync(filePath, "utf8");
    const parsed: unknown = JSON.parse(contents);
    return isAssessment(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function loadAssessment(): Assessment {
  const result = readAssessment(RESULT_PATH);
  if (result) return result;

  const fallback = readAssessment(FALLBACK_PATH);
  if (fallback) return fallback;

  throw new Error("No valid assessment data found in result.json or assessment.json.");
}
