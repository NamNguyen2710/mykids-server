import {
  Controller,
  Post,
  Param,
  Delete,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  HttpCode,
  Request,
  Query,
  ParseIntPipe,
  ForbiddenException,
  Get,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { AssetService } from './asset.service';
import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';
import { ValidationService } from 'src/users/validation.service';

import { QueryAssetSchema, QueryAssetDto } from 'src/asset/dto/query-asset.dto';
import { READ_SCHOOL_ASSETS_PERMISSION } from 'src/role/entities/permission.data';

import { RequestWithUser } from 'src/utils/request-with-user';

@UseGuards(LoginGuard)
@Controller('asset')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly validationService: ValidationService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  create(@UploadedFiles() files) {
    return this.assetService.create(files);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.assetService.remove(+id);
  }

  @Get('/school/:schoolId')
  async findSchoolPostAssets(
    @Request() request: RequestWithUser,
    @Param('schoolId', ParseIntPipe) schoolId: number,
    @Query(new ZodValidationPipe(QueryAssetSchema)) query: QueryAssetDto,
  ) {
    const permission =
      await this.validationService.validateSchoolFacultyPermission(
        request.user.id,
        { schoolId, permissionId: READ_SCHOOL_ASSETS_PERMISSION },
      );
    if (!permission)
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );

    return this.assetService.findBySchoolPost(
      schoolId,
      query.limit,
      query.page,
    );
  }
}
