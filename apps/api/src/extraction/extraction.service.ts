import { Inject, Injectable } from "@nestjs/common";
import { JobPageFetcherService } from "../job-pages/job-page-fetcher.service";
import { normalizeHttpUrl } from "../job-pages/public-url";
import {
  JOB_EXTRACTION_PROVIDER,
  type JobExtractionProvider,
  ProviderResponseError,
} from "./job-extraction.provider";
import { validateExtractionResult } from "./extraction-result";
import { ExtractionDiagnosticsService } from './extraction-diagnostics.service';

@Injectable()
export class ExtractionService {
  constructor(
    private readonly pages: JobPageFetcherService,
    @Inject(JOB_EXTRACTION_PROVIDER)
    private readonly provider: JobExtractionProvider,
    private readonly diagnostics: ExtractionDiagnosticsService,
  ) {}
  async preview(url: string) {
    const sourceUrl = normalizeHttpUrl(url);
    const page = await this.pages.fetch(sourceUrl);
    let rawResponse: unknown;
    try {
      rawResponse = await this.provider.extract(page);
      return { sourceUrl, ...validateExtractionResult(rawResponse) };
    } catch (error) {
      await this.diagnostics.record({
        sourceUrl,
        providerName: this.provider.providerName,
        error,
        rawResponse: error instanceof ProviderResponseError ? error.rawResponse : rawResponse,
      });
      throw error;
    }
  }
}
