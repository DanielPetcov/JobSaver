import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserModule } from '../users/current-user.module';
import { ExtractionModule } from '../extraction/extraction.module';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { JobApplication } from './job-application.entity';
import { Skill } from './skill.entity';
@Module({ imports: [TypeOrmModule.forFeature([JobApplication, Skill]), CurrentUserModule, ExtractionModule], controllers: [ApplicationsController], providers: [ApplicationsService] })
export class ApplicationsModule {}

