import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsModule } from './applications/applications.module';
import { HealthController } from './health.controller';
import { JobPagesModule } from './job-pages/job-pages.module';
import { ExtractionModule } from './extraction/extraction.module';
import { User } from './users/user.entity';
import { JobApplication } from './applications/job-application.entity';
import { Skill } from './applications/skill.entity';
import { CurrentUserModule } from './users/current-user.module';
import { ExtractionDiagnostic } from './extraction/extraction-diagnostic.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, JobApplication, Skill, ExtractionDiagnostic],
      synchronize: false,
    }),
    CurrentUserModule,
    JobPagesModule,
    ExtractionModule,
    ApplicationsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
