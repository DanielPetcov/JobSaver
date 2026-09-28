import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractionDiagnostic } from './extraction-diagnostic.entity';

const MAX_RAW_RESPONSE_LENGTH = 20_000;

@Injectable()
export class ExtractionDiagnosticsService {
  private readonly logger = new Logger(ExtractionDiagnosticsService.name);

  constructor(@InjectRepository(ExtractionDiagnostic) private readonly diagnostics: Repository<ExtractionDiagnostic>) {}

  async record(input: { sourceUrl: string; providerName: string; error: unknown; rawResponse: unknown }): Promise<void> {
    const errorMessage = input.error instanceof Error ? input.error.message : 'Unknown extraction error';
    const rawResponse = serializeRawResponse(input.rawResponse);
    try {
      const diagnostic = await this.diagnostics.save(this.diagnostics.create({
        sourceUrl: input.sourceUrl,
        providerName: input.providerName,
        errorMessage: errorMessage.slice(0, 500),
        rawResponse,
      }));
      this.logger.warn(`Saved extraction diagnostic ${diagnostic.id} for ${input.providerName}: ${errorMessage}`);
    } catch (diagnosticError) {
      this.logger.error(`Could not save extraction diagnostic: ${diagnosticError instanceof Error ? diagnosticError.message : 'unknown error'}`);
    }
  }

  async list(limit = 20): Promise<ExtractionDiagnostic[]> {
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 20;
    return this.diagnostics.find({ order: { createdAt: 'DESC' }, take: safeLimit });
  }
}

function serializeRawResponse(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const raw = typeof value === 'string' ? value : JSON.stringify(value);
  return raw.length > MAX_RAW_RESPONSE_LENGTH ? `${raw.slice(0, MAX_RAW_RESPONSE_LENGTH)}…[truncated]` : raw;
}
