export type AssessmentSection = {
  id: string;
  title: string;
  timePercent: number;
  points: string[];
  speakingNotes: string[];
  diagram: string;
};

export type Assessment = {
  title: string;
  taskType: string;
  summary: string[];
  sections: AssessmentSection[];
};
