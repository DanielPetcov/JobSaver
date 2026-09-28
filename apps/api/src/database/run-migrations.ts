import { AppDataSource } from './data-source';
async function run(): Promise<void> { await AppDataSource.initialize(); await AppDataSource.runMigrations(); await AppDataSource.destroy(); }
void run();

