import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Request,
  UseGuards,
  Query,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';

import { LoaService } from './loa.service';
import { LoginGuard } from 'src/guard/login.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import { LOA_STATUS } from './entities/loa.entity';
import { CreateLoaDto, CreateLoaSchema } from './dto/create-loa.dto';
import { QueryLoaDto, QueryLoaSchema } from './dto/query-loa.dto';
import { UpdateLoaDto, UpdateLoaSchema } from './dto/update-loa.dto';

@UseGuards(LoginGuard)
@Controller('loa')
export class LoaController {
  constructor(private readonly loaService: LoaService) {}

  @Post()
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateLoaSchema)) createLoaDto: CreateLoaDto,
  ) {
    return this.loaService.create(req.user.sub, createLoaDto);
  }

  @Get()
  async findAll(
    @Request() request,
    @Query(new ZodValidationPipe(QueryLoaSchema))
    query: QueryLoaDto,
  ): Promise<any> {
    return this.loaService.findAll(request.user.sub, query);
  }

  @Get(':loaID')
  async findOne(
    @Request() request,
    @Param('loaID', ParseIntPipe) loaID: number,
  ) {
    const validation =
      (await this.loaService.validateLoaAdminPermission(
        loaID,
        request.user.sub,
      )) ||
      (await this.loaService.validateLoaParentPermission(
        loaID,
        request.user.sub,
      ));
    if (!validation) throw new NotFoundException('Cannot find LOA notice!');

    return this.loaService.findOne(request.user.sub, loaID);
  }

  @Put(':loaID/approve')
  async approve(
    @Request() request,
    @Param('loaID', ParseIntPipe) loaID: number,
  ) {
    const validation = await this.loaService.validateLoaAdminPermission(
      loaID,
      request.user.sub,
    );
    if (!validation) throw new NotFoundException('Cannot find LOA notice!');

    return this.loaService.update(loaID, { approveStatus: LOA_STATUS.APPROVE });
  }

  @Put(':loaID/reject')
  async reject(
    @Request() request,
    @Param('loaID', ParseIntPipe) loaID: number,
  ) {
    const validation = await this.loaService.validateLoaAdminPermission(
      loaID,
      request.user.sub,
    );
    if (!validation) throw new NotFoundException('Cannot find LOA notice!');

    return this.loaService.update(loaID, { approveStatus: LOA_STATUS.REJECT });
  }

  @Put(':loaID/cancel')
  async cancel(
    @Request() request,
    @Param('loaID', ParseIntPipe) loaID: number,
  ) {
    const validation = await this.loaService.validateLoaParentPermission(
      loaID,
      request.user.sub,
    );
    if (!validation) throw new NotFoundException('Cannot find LOA notice!');

    return this.loaService.update(loaID, { approveStatus: LOA_STATUS.CANCEL });
  }

  @Put(':loaID')
  async update(
    @Request() request,
    @Param('loaID', ParseIntPipe) loaID: number,
    @Body(new ZodValidationPipe(UpdateLoaSchema)) updateLoaDto: UpdateLoaDto,
  ) {
    const validation = await this.loaService.validateLoaParentPermission(
      loaID,
      request.user.sub,
    );
    if (!validation) throw new NotFoundException('Cannot find LOA notice!');

    delete updateLoaDto.approveStatus;
    return this.loaService.update(loaID, updateLoaDto);
  }
}
