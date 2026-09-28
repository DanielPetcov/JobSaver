import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('extraction_diagnostics')
export class ExtractionDiagnostic {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ name: 'source_url', type: 'text' }) sourceUrl!: string;
  @Column({ name: 'provider_name', length: 40 }) providerName!: string;
  @Column({ name: 'error_message', length: 500 }) errorMessage!: string;
  @Column({ name: 'raw_response', type: 'text', nullable: true }) rawResponse!: string | null;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
}
