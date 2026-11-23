import {
  AUTH_HASHES,
  AUTH_PEPPER,
  type AuthQuestionId,
} from "../config/authHashes.generated";
import {
  normalizeBirthday,
  normalizeHometown,
  normalizeOptionId,
} from "./normalize";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashAnswer(
  questionId: AuthQuestionId,
  normalizedValue: string,
): Promise<string> {
  const payload = `${AUTH_PEPPER}|${questionId}|${normalizedValue}`;
  const data = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

export async function verifyAllAnswers(input: {
  birthday: string;
  hometown: string;
  movieOptionId: string;
  gameOptionId: string;
}): Promise<boolean> {
  const pairs: [AuthQuestionId, string][] = [
    ["birthday", normalizeBirthday(input.birthday)],
    ["hometown", normalizeHometown(input.hometown)],
    ["favorite_movie", normalizeOptionId(input.movieOptionId)],
    ["favorite_game", normalizeOptionId(input.gameOptionId)],
  ];

  for (const [questionId, value] of pairs) {
    if (!value) {
      return false;
    }
    const computed = await hashAnswer(questionId, value);
    if (computed !== AUTH_HASHES[questionId]) {
      return false;
    }
  }

  return true;
}