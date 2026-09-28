import { Module } from '@nestjs/common';
import { JobPageFetcherService } from './job-page-fetcher.service';
@Module({ providers: [JobPageFetcherService], exports: [JobPageFetcherService] }) export class JobPagesModule {}
