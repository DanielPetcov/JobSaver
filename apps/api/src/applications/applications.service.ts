import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CurrentUserService } from '../users/current-user.service';
import { normalizeHttpUrl } from '../job-pages/public-url';
import { CreateApplicationDto, ListApplicationsQueryDto, UpdateApplicationDto } from './dto/application.dto';
import { JobApplication } from './job-application.entity';
import { Skill } from './skill.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(JobApplication) private readonly applications: Repository<JobApplication>,
    @InjectRepository(Skill) private readonly skills: Repository<Skill>,
    private readonly currentUser: CurrentUserService,
  ) {}

  async create(dto: CreateApplicationDto): Promise<JobApplication> {
    const userId = await this.currentUser.getId();
    const application = this.applications.create({
      userId,
      companyName: dto.companyName.trim(), jobTitle: dto.jobTitle.trim(), sourceUrl: normalizeHttpUrl(dto.sourceUrl),
      companyWebsiteUrl: nullableTrim(dto.companyWebsiteUrl), shortDescription: nullableTrim(dto.shortDescription),
      skills: await this.resolveSkills(dto.skills), status: dto.status ?? undefined, dateApplied: new Date(),
    });
    return this.applications.save(application);
  }

  async list(query: ListApplicationsQueryDto): Promise<{ data: JobApplication[]; meta: { page: number; limit: number; total: number; pageCount: number } }> {
    const userId = await this.currentUser.getId();
    const builder = this.applications.createQueryBuilder('application').leftJoinAndSelect('application.skills', 'skill').where('application.user_id = :userId', { userId });
    if (query.status) builder.andWhere('application.status = :status', { status: query.status });
    if (query.q) {
      const search = `%${query.q.trim()}%`;
      builder.andWhere(new Brackets((where) => where.where('application.company_name ILIKE :q', { q: search }).orWhere('application.job_title ILIKE :q', { q: search })));
    }
    builder.orderBy('application.dateApplied', 'DESC').skip((query.page - 1) * query.limit).take(query.limit);
    const [data, total] = await builder.getManyAndCount();
    return { data, meta: { page: query.page, limit: query.limit, total, pageCount: Math.ceil(total / query.limit) } };
  }

  async get(id: string): Promise<JobApplication> {
    const userId = await this.currentUser.getId();
    const application = await this.applications.findOneBy({ id, userId });
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async update(id: string, dto: UpdateApplicationDto): Promise<JobApplication> {
    const application = await this.get(id);
    if (dto.companyName !== undefined) application.companyName = dto.companyName.trim();
    if (dto.jobTitle !== undefined) application.jobTitle = dto.jobTitle.trim();
    if (dto.sourceUrl !== undefined) application.sourceUrl = normalizeHttpUrl(dto.sourceUrl);
    if (dto.companyWebsiteUrl !== undefined) application.companyWebsiteUrl = nullableTrim(dto.companyWebsiteUrl);
    if (dto.shortDescription !== undefined) application.shortDescription = nullableTrim(dto.shortDescription);
    if (dto.skills !== undefined) application.skills = await this.resolveSkills(dto.skills);
    if (dto.status !== undefined) application.status = dto.status;
    if (dto.dateApplied !== undefined) application.dateApplied = new Date(dto.dateApplied);
    return this.applications.save(application);
  }

  async remove(id: string): Promise<void> { await this.applications.remove(await this.get(id)); }

  private async resolveSkills(values: string[]): Promise<Skill[]> {
    const unique = [...new Map(values.map((value) => { const name = value.trim(); return [skillSlug(name), name] as const; })).entries()];
    return Promise.all(unique.map(async ([slug, name]) => (await this.skills.findOneBy({ slug })) ?? this.skills.save(this.skills.create({ slug, name }))));
  }
}

function nullableTrim(value: string | null | undefined): string | null { const trimmed = value?.trim(); return trimmed || null; }
export function skillSlug(value: string): string { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 96); }
