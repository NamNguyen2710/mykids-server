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

import { LOA_STATUS } from './entities/loa.entity';
import { CreateLoaDto } from './dto/create-loa.dto';
import { QueryLoaSchema } from './dto/query-loa.dto';
import { UpdateLoaDto } from './dto/update-loa.dto';

@UseGuards(LoginGuard)
@Controller('loa')
export class LoaController {
  constructor(private readonly loaService: LoaService) {}

  @Post()
  create(@Request() req, @Body() createLoaDto: CreateLoaDto) {
    return this.loaService.create(req.user.sub, createLoaDto);
  }

  @Get()
  findAll(@Request() request, @Query() query): Promise<any> {
    const loaQuery = QueryLoaSchema.parse(query);
    return this.loaService.findAll(request.user.sub, loaQuery);
  }

  @Get(':loaID')
  findOne(@Request() request, @Param('loaID', ParseIntPipe) loaID: number) {
    return this.loaService.findOne(request.user.sub, loaID);
  }

  @Put(':loaID/approve')
  approve(@Request() request, @Param('loaID', ParseIntPipe) loaID: number) {
    const validation = this.loaService.validateLoaAdminPermission(
      loaID,
      request.user.sub,
    );
    if (!validation) throw new NotFoundException('Cannot find LOA notice!');

    return this.loaService.update(loaID, { approveStatus: LOA_STATUS.APPROVE });
  }

  @Put(':loaID/reject')
  reject(@Request() request, @Param('loaID', ParseIntPipe) loaID: number) {
    const validation = this.loaService.validateLoaAdminPermission(
      loaID,
      request.user.sub,
    );
    if (!validation) throw new NotFoundException('Cannot find LOA notice!');

    return this.loaService.update(loaID, { approveStatus: LOA_STATUS.REJECT });
  }

  @Put(':loaID/cancel')
  cancel(@Request() request, @Param('loaID', ParseIntPipe) loaID: number) {
    const validation = this.loaService.validateLoaParentPermission(
      loaID,
      request.user.sub,
    );
    if (!validation) throw new NotFoundException('Cannot find LOA notice!');

    return this.loaService.update(loaID, { approveStatus: LOA_STATUS.CANCEL });
  }

  @Put(':loaID')
  update(
    @Request() request,
    @Param('loaID', ParseIntPipe) loaID: number,
    @Body() updateLoaDto: UpdateLoaDto,
  ) {
    const validation = this.loaService.validateLoaParentPermission(
      loaID,
      request.user.sub,
    );
    if (!validation) throw new NotFoundException('Cannot find LOA notice!');

    delete updateLoaDto.approveStatus;
    return this.loaService.update(loaID, updateLoaDto);
  }
}
