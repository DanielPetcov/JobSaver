import { Injectable } from "@nestjs/common";
import type { CleanJobPage } from "../../job-pages/job-page-fetcher.service";
import type {
  JobExtractionProvider,
  JobExtractionResult,
} from "../job-extraction.provider";

const SKILLS = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Figma",
  "Excel",
];

@Injectable()
export class MockJobExtractionProvider implements JobExtractionProvider {
  readonly providerName = 'mock';

  async extract(page: CleanJobPage): Promise<JobExtractionResult> {
    const heading =
      page.title
        ?.split(/[|—–-]/)
        .map((part) => part.trim())
        .find((part) =>
          /engineer|developer|designer|manager|analyst|intern|specialist/i.test(
            part,
          ),
        ) ?? null;
    const skills = SKILLS.filter((skill) =>
      new RegExp(`\\b${skill.replace(".", "\\.")}\\b`, "i").test(page.text),
    ).slice(0, 3);
    return {
      companyName: null,
      jobTitle: heading,
      companyWebsiteUrl: null,
      shortDescription: page.description?.slice(0, 1200) ?? null,
      skills,
    };
  }
}
