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
import { ResponseLoaSchema } from 'src/loa/dto/response-loa.dto';
import * as Role from 'src/users/entity/roles.data';

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
    const res = await this.loaService.findAll(
      query,
      request.user.sub,
      request.user.role,
    );
    return {
      data: res.data.map((datum) => ResponseLoaSchema.parse(datum)),
      pagination: res.pagination,
    };
  }

  @Get(':loaID')
  async findOne(
    @Request() request,
    @Param('loaID', ParseIntPipe) loaID: number,
  ) {
    let permission = false;
    if (request.user.role === Role.SuperAdmin.name)
      permission = await this.loaService.validateLoaAdminPermission(
        loaID,
        request.user.sub,
      );
    if (request.user.role === Role.Parent.name)
      permission = await this.loaService.validateLoaParentPermission(
        loaID,
        request.user.sub,
      );
    if (!permission) throw new NotFoundException('Cannot find LOA notice!');

    const res = await this.loaService.findOne(request.user.sub);
    return ResponseLoaSchema.parse(res);
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

    const res = await this.loaService.update(loaID, {
      approveStatus: LOA_STATUS.APPROVE,
    });
    return ResponseLoaSchema.parse(res);
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

    const res = await this.loaService.update(loaID, {
      approveStatus: LOA_STATUS.REJECT,
    });
    return ResponseLoaSchema.parse(res);
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

    const res = await this.loaService.update(loaID, {
      approveStatus: LOA_STATUS.CANCEL,
    });
    return ResponseLoaSchema.parse(res);
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
    const res = await this.loaService.update(loaID, updateLoaDto);
    return ResponseLoaSchema.parse(res);
  }
}
