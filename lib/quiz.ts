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

/**
 * Softer 4-letter vibe (E/I, N/S, F/T, P/J), like the well-known 16 personality letters.
 * Per answer: [E+ / I-, N+ / S-, F+ / T-, P+ / J-]. Only an indication, never final.
 */
const TRAITS: [number, number, number, number][][] = [
  [[2, 0, 0, 1], [-1, 1, 2, 0], [-1, 0, 0, -1], [1, -1, 0, 1]],
  [[2, 0, 0, 1], [-2, 0, 0, -1], [0, 2, 0, 1], [-1, 0, 2, 0]],
  [[0, 1, 2, 0], [1, -2, 0, 0], [0, 0, 0, 1], [0, 2, -2, -1]],
  [[2, 0, 0, 0], [-1, 0, -1, 0], [0, 1, 1, 0], [-2, 0, 0, 0]],
  [[2, -1, 0, -1], [-2, 1, 0, 0], [0, 1, 0, 2], [-1, 0, 2, -1]],
  [[2, 0, 0, 1], [-1, 0, 0, 0], [-1, 0, 0, 1], [0, 0, 1, -1]],
  [[2, 0, 0, 1], [-2, 0, 1, -1], [1, 1, 0, 2], [0, 0, 2, -1]],
  [[2, 0, 0, 1], [0, 1, 1, -1], [-2, -1, 0, 0], [1, 0, 0, 2]],
  [[-1, 1, 1, 0], [2, 0, 0, 0], [1, -1, -1, 1], [0, 0, 0, 0]],
  [[1, 0, 0, 2], [0, 1, 2, 0], [0, 2, 0, 1], [-1, -1, 1, -2]],
];

export type Traits = { code: string; pct: [number, number, number, number] };

/** pct = how far towards E, N, F, P (0-100). */
export function quizTraits(answers: (number | null)[]): Traits | null {
  if (answers.length !== TRAITS.length || answers.some((a) => a === null || a < 0 || a > 3)) return null;
  const sum = [0, 0, 0, 0], max = [0, 0, 0, 0];
  answers.forEach((a, i) => {
    TRAITS[i][a as number].forEach((v, k) => { sum[k] += v; });
    for (let k = 0; k < 4; k++) max[k] += Math.max(...TRAITS[i].map((o) => Math.abs(o[k])));
  });
  const pct = sum.map((s, k) => Math.round(50 + (50 * s) / (max[k] || 1))) as Traits["pct"];
  const type = quizType(answers);
  const e = type === "chatter" || type === "connector";
  pct[0] = e ? Math.max(pct[0], 52) : Math.min(pct[0], 48);
  const code = (e ? "E" : "I") + (pct[1] >= 50 ? "N" : "S") + (pct[2] >= 50 ? "F" : "T") + (pct[3] >= 50 ? "P" : "J");
  return { code, pct };
}
