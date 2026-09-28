import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUuidDefaults1710000000001 implements MigrationInterface {
  name = 'AddUuidDefaults1710000000001';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()');
    await queryRunner.query('ALTER TABLE "skills" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()');
    await queryRunner.query('ALTER TABLE "job_applications" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()');
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "job_applications" ALTER COLUMN "id" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "skills" ALTER COLUMN "id" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT');
  }
}
