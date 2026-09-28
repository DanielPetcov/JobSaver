import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExtractionDiagnostics1710000000002 implements MigrationInterface {
  name = 'AddExtractionDiagnostics1710000000002';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "extraction_diagnostics" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "source_url" text NOT NULL, "provider_name" varchar(40) NOT NULL, "error_message" varchar(500) NOT NULL, "raw_response" text, "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT "PK_extraction_diagnostics" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE INDEX "IDX_extraction_diagnostics_created_at" ON "extraction_diagnostics" ("created_at" DESC)');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "extraction_diagnostics"');
  }
}
