import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { JobApplication } from '../applications/job-application.entity';
import { Skill } from '../applications/skill.entity';
import { InitialSchema1710000000000 } from './migrations/1710000000000-initial-schema';
import { AddUuidDefaults1710000000001 } from './migrations/1710000000001-add-uuid-defaults';
import { ExtractionDiagnostic } from '../extraction/extraction-diagnostic.entity';
import { AddExtractionDiagnostics1710000000002 } from './migrations/1710000000002-add-extraction-diagnostics';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL ?? 'postgres://jobtrack:jobtrack@localhost:5432/jobtrack',
  entities: [User, JobApplication, Skill, ExtractionDiagnostic],
  migrations: [InitialSchema1710000000000, AddUuidDefaults1710000000001, AddExtractionDiagnostics1710000000002],
  synchronize: false,
});
