import { IsUrl } from "class-validator";
export class ExtractPreviewDto {
  @IsUrl({ protocols: ["http", "https"], require_protocol: true }) url!: string;
}
