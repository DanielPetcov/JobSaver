import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  name = 'InitialSchema1710000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query(`CREATE TYPE "application_status" AS ENUM ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN', 'ARCHIVED')`);
    await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" varchar(320) NOT NULL, "password_hash" varchar, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_users" PRIMARY KEY ("id"), CONSTRAINT "UQ_users_email" UNIQUE ("email"))`);
    await queryRunner.query(`CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" varchar(80) NOT NULL, "slug" varchar(96) NOT NULL, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_skills" PRIMARY KEY ("id"), CONSTRAINT "UQ_skills_slug" UNIQUE ("slug"))`);
    await queryRunner.query(`CREATE TABLE "job_applications" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "company_name" varchar(160) NOT NULL, "job_title" varchar(160) NOT NULL, "source_url" text NOT NULL, "company_website_url" text, "short_description" text, "date_applied" TIMESTAMPTZ NOT NULL, "status" "application_status" NOT NULL DEFAULT 'APPLIED', "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_job_applications" PRIMARY KEY ("id"), CONSTRAINT "FK_job_applications_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`CREATE TABLE "job_application_skills" ("job_application_id" uuid NOT NULL, "skill_id" uuid NOT NULL, CONSTRAINT "PK_job_application_skills" PRIMARY KEY ("job_application_id", "skill_id"), CONSTRAINT "FK_jas_application" FOREIGN KEY ("job_application_id") REFERENCES "job_applications"("id") ON DELETE CASCADE, CONSTRAINT "FK_jas_skill" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE)`);
    await queryRunner.query(`CREATE INDEX "IDX_applications_user_date" ON "job_applications" ("user_id", "date_applied" DESC)`);
    await queryRunner.query(`CREATE INDEX "IDX_applications_user_status" ON "job_applications" ("user_id", "status")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "job_application_skills"');
    await queryRunner.query('DROP TABLE "job_applications"');
    await queryRunner.query('DROP TABLE "skills"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "application_status"');
  }
}

