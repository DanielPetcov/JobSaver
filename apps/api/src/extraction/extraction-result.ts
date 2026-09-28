import { UnprocessableEntityException } from "@nestjs/common";
import type { JobExtractionResult } from "./job-extraction.provider";

export function validateExtractionResult(value: unknown): JobExtractionResult {
  if (!value || typeof value !== "object")
    throw new UnprocessableEntityException(
      "The AI returned an invalid extraction",
    );
  const record = value as Record<string, unknown>;
  const nullableText = (field: string, max: number): string | null => {
    const raw = record[field];
    if (raw === null) return null;
    if (typeof raw !== "string" || !raw.trim() || raw.trim().length > max)
      throw new UnprocessableEntityException(
        "The AI returned an invalid extraction",
      );
    return raw.trim();
  };
  const companyName = nullableText("companyName", 160);
  const jobTitle = nullableText("jobTitle", 160);
  const shortDescription = nullableText("shortDescription", 1200);
  const website = nullableText("companyWebsiteUrl", 2048);
  if (website !== null) {
    try {
      const url = new URL(website);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      throw new UnprocessableEntityException(
        "The AI returned an invalid company website",
      );
    }
  }
  if (
    !Array.isArray(record.skills) ||
    record.skills.length > 3 ||
    record.skills.some(
      (skill) =>
        typeof skill !== "string" || !skill.trim() || skill.trim().length > 80,
    )
  )
    throw new UnprocessableEntityException("The AI returned invalid skills");
  return {
    companyName,
    jobTitle,
    companyWebsiteUrl: website,
    shortDescription,
    skills: [
      ...new Set(record.skills.map((skill) => (skill as string).trim())),
    ],
  };
}
