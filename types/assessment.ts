export type AssessmentSection = {
  id: string;
  title: string;
  points: string[];
  speakingNotes: string[];
  visual: string;
};

export type Assessment = {
  title: string;
  taskType: string;
  summary: string[];
  sections: AssessmentSection[];
};
