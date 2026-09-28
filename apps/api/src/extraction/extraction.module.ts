import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPagesModule } from '../job-pages/job-pages.module';
import { ExtractionService } from './extraction.service';
import { JOB_EXTRACTION_PROVIDER } from './job-extraction.provider';
import { MockJobExtractionProvider } from './providers/mock-job-extraction.provider';
import { OpenAiJobExtractionProvider } from './providers/openai-job-extraction.provider';
import { OpenRouterJobExtractionProvider } from './providers/openrouter-job-extraction.provider';
import { ExtractionDiagnostic } from './extraction-diagnostic.entity';
import { ExtractionDiagnosticsService } from './extraction-diagnostics.service';

@Module({
  imports: [JobPagesModule, TypeOrmModule.forFeature([ExtractionDiagnostic])], providers: [MockJobExtractionProvider, OpenAiJobExtractionProvider, OpenRouterJobExtractionProvider, ExtractionDiagnosticsService, ExtractionService, {
    provide: JOB_EXTRACTION_PROVIDER, inject: [MockJobExtractionProvider, OpenAiJobExtractionProvider, OpenRouterJobExtractionProvider],
    useFactory: (mock: MockJobExtractionProvider, openai: OpenAiJobExtractionProvider, openrouter: OpenRouterJobExtractionProvider) => {
      if (process.env.AI_PROVIDER === 'openai') return openai;
      if (process.env.AI_PROVIDER === 'openrouter') return openrouter;
      return mock;
    },
  }], exports: [ExtractionService, ExtractionDiagnosticsService],
})
export class ExtractionModule {}
