import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { JobApplication } from '../applications/job-application.entity';
import { Skill } from '../applications/skill.entity';
import { InitialSchema1710000000000 } from './migrations/1710000000000-initial-schema';
import { AddUuidDefaults1710000000001 } from './migrations/1710000000001-add-uuid-defaults';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL ?? 'postgres://jobtrack:jobtrack@localhost:5432/jobtrack',
  entities: [User, JobApplication, Skill],
  migrations: [InitialSchema1710000000000, AddUuidDefaults1710000000001],
  synchronize: false,
});
