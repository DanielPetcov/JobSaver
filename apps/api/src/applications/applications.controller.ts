import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import {
  CreateApplicationDto,
  ListApplicationsQueryDto,
  UpdateApplicationDto,
} from "./dto/application.dto";
import { ExtractionService } from "../extraction/extraction.service";
import { ExtractPreviewDto } from "../extraction/extract-preview.dto";

@Controller("applications")
export class ApplicationsController {
  constructor(
    private readonly applications: ApplicationsService,
    private readonly extraction: ExtractionService,
  ) {}
  @Post("extract-preview") @HttpCode(200) extractPreview(
    @Body() dto: ExtractPreviewDto,
  ) {
    return this.extraction.preview(dto.url);
  }
  @Post() create(@Body() dto: CreateApplicationDto) {
    return this.applications.create(dto);
  }
  @Get() list(@Query() query: ListApplicationsQueryDto) {
    return this.applications.list(query);
  }
  @Get(":id") get(@Param("id") id: string) {
    return this.applications.get(id);
  }
  @Patch(":id") update(
    @Param("id") id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.applications.update(id, dto);
  }
  @Delete(":id") @HttpCode(204) async remove(
    @Param("id") id: string,
  ): Promise<void> {
    await this.applications.remove(id);
  }
}
