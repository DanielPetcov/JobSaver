import { Inject, Injectable } from "@nestjs/common";
import { JobPageFetcherService } from "../job-pages/job-page-fetcher.service";
import { normalizeHttpUrl } from "../job-pages/public-url";
import {
  JOB_EXTRACTION_PROVIDER,
  type JobExtractionProvider,
} from "./job-extraction.provider";
import { validateExtractionResult } from "./extraction-result";

@Injectable()
export class ExtractionService {
  constructor(
    private readonly pages: JobPageFetcherService,
    @Inject(JOB_EXTRACTION_PROVIDER)
    private readonly provider: JobExtractionProvider,
  ) {}
  async preview(url: string) {
    const sourceUrl = normalizeHttpUrl(url);
    const page = await this.pages.fetch(sourceUrl);
    return {
      sourceUrl,
      ...validateExtractionResult(await this.provider.extract(page)),
    };
  }
}
