import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { ApplicationStatus } from "./application-status";
import { Skill } from "./skill.entity";

@Entity("job_applications")
export class JobApplication {
  @PrimaryGeneratedColumn("uuid") id!: string;
  @Column({ name: "user_id", type: "uuid" }) userId!: string;
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;
  @Column({ name: "company_name", length: 160 }) companyName!: string;
  @Column({ name: "job_title", length: 160 }) jobTitle!: string;
  @Column({ name: "source_url", type: "text" }) sourceUrl!: string;
  @Column({ name: "company_website_url", type: "text", nullable: true })
  companyWebsiteUrl!: string | null;
  @Column({ name: "short_description", type: "text", nullable: true })
  shortDescription!: string | null;
  @Column({ name: "date_applied", type: "timestamptz" }) dateApplied!: Date;
  @Column({
    type: "enum",
    enum: ApplicationStatus,
    enumName: "application_status",
    default: ApplicationStatus.APPLIED,
  })
  status!: ApplicationStatus;
  @ManyToMany(() => Skill, { eager: true })
  @JoinTable({
    name: "job_application_skills",
    joinColumn: { name: "job_application_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "skill_id", referencedColumnName: "id" },
  })
  skills!: Skill[];
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
