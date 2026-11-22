/**
 * Personality quiz: 10 questions, 4 answers each. Every answer nudges two scales:
 * energy (+ outgoing, - quiet) and talk (+ deep, - light/adventurous).
 * The two scales give one of four tablemate types, used to match tables.
 */
export type TypeKey = "chatter" | "connector" | "explorer" | "listener";

// [energy, deep] per answer, per question.
const SCORES: [number, number][][] = [
  [[2, 0], [-1, 2], [-1, 0], [1, -2]],
  [[2, -1], [-2, 0], [0, -1], [-1, 2]],
  [[0, 2], [1, -2], [0, 0], [0, 1]],
  [[2, -1], [-1, 0], [0, 2], [-2, 0]],
  [[2, -1], [-2, 1], [0, -2], [-1, 2]],
  [[2, 0], [-1, 0], [-1, 1], [0, -1]],
  [[2, -2], [-2, 2], [0, -2], [1, 1]],
  [[2, -2], [0, 2], [-2, 0], [1, -1]],
  [[-1, 2], [2, -1], [1, -2], [0, 0]],
  [[1, -2], [0, 2], [0, -1], [-1, 1]],
];
export const QUIZ_LENGTH = SCORES.length;

export function quizType(answers: (number | null)[]): TypeKey | null {
  if (answers.length !== SCORES.length || answers.some((a) => a === null || a < 0 || a > 3)) return null;
  let energy = 0, deep = 0;
  answers.forEach((a, i) => { const [e, d] = SCORES[i][a as number]; energy += e; deep += d; });
  const outgoing = energy > 0 || (energy === 0 && answers[0] === 0);
  const deepTalk = deep >= 0;
  if (outgoing) return deepTalk ? "connector" : "chatter";
  return deepTalk ? "listener" : "explorer";
}
