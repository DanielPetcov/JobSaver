import type { CleanJobPage } from "../job-pages/job-page-fetcher.service";

export interface JobExtractionResult {
  companyName: string | null;
  jobTitle: string | null;
  companyWebsiteUrl: string | null;
  shortDescription: string | null;
  skills: string[];
}
export interface JobExtractionProvider {
  readonly providerName: string;
  extract(page: CleanJobPage): Promise<unknown>;
}

export class ProviderResponseError extends Error {
  constructor(message: string, readonly rawResponse: string | null = null) {
    super(message);
  }
}
export const JOB_EXTRACTION_PROVIDER = Symbol("JOB_EXTRACTION_PROVIDER");
