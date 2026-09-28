import { AppDataSource } from './data-source';
import { seedDevelopmentUser } from './seed';
async function run(): Promise<void> { await AppDataSource.initialize(); await seedDevelopmentUser(AppDataSource); await AppDataSource.destroy(); }
void run();

