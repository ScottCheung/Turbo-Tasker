# Prompts

## Update the assessment JSON

Read `input/TASK_ORIGINAL.md` and `input/MY_APPROACH.md`, then update only `data/assessment.json`.

Rules:

- Do not modify React components, CSS, Tailwind, Next.js config, dependencies, or any other file.
- Return valid JSON only in `data/assessment.json`.
- Keep the exact top-level fields: `title`, `taskType`, `summary`, and `sections`.
- Keep the exact section fields: `id`, `title`, `timePercent`, `points`, `speakingNotes`, and `diagram`.
- Do not add unknown fields.
- Use 3–8 sections. Section IDs should be stable kebab-case values.
- Make all `timePercent` values add up to exactly 100.
- Keep `points` concise and scannable.
- Keep each `speakingNotes` item to roughly 8–15 English words and one sentence.
- Use an empty string for `diagram` unless a simple Mermaid `flowchart` materially improves the explanation.
