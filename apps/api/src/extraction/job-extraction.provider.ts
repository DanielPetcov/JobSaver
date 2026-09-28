import type { CleanJobPage } from "../job-pages/job-page-fetcher.service";

export interface JobExtractionResult {
  companyName: string | null;
  jobTitle: string | null;
  companyWebsiteUrl: string | null;
  shortDescription: string | null;
  skills: string[];
}
export interface JobExtractionProvider {
  extract(page: CleanJobPage): Promise<JobExtractionResult>;
}
export const JOB_EXTRACTION_PROVIDER = Symbol("JOB_EXTRACTION_PROVIDER");
