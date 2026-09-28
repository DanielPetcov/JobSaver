import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayUnique, IsArray, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUrl, Length, Max, Min } from 'class-validator';
import { ApplicationStatus } from '../application-status';

export class CreateApplicationDto {
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) sourceUrl!: string;
  @IsString() @Length(1, 160) companyName!: string;
  @IsString() @Length(1, 160) jobTitle!: string;
  @IsOptional() @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) companyWebsiteUrl?: string | null;
  @IsOptional() @IsString() @Length(1, 1200) shortDescription?: string | null;
  @IsArray() @ArrayMaxSize(3) @ArrayUnique() @IsString({ each: true }) @Length(1, 80, { each: true }) skills!: string[];
  @IsOptional() @IsEnum(ApplicationStatus) status?: ApplicationStatus;
}

export class UpdateApplicationDto {
  @IsOptional() @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) sourceUrl?: string;
  @IsOptional() @IsString() @Length(1, 160) companyName?: string;
  @IsOptional() @IsString() @Length(1, 160) jobTitle?: string;
  @IsOptional() @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) companyWebsiteUrl?: string | null;
  @IsOptional() @IsString() @Length(1, 1200) shortDescription?: string | null;
  @IsOptional() @IsArray() @ArrayMaxSize(3) @ArrayUnique() @IsString({ each: true }) @Length(1, 80, { each: true }) skills?: string[];
  @IsOptional() @IsEnum(ApplicationStatus) status?: ApplicationStatus;
  @IsOptional() @IsDateString() dateApplied?: string;
}

export class ListApplicationsQueryDto {
  @IsOptional() @IsEnum(ApplicationStatus) status?: ApplicationStatus;
  @IsOptional() @IsString() @Length(1, 120) q?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 25;
}

