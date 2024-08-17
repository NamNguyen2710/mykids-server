import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Request,
} from '@nestjs/common';
import { MedicalService } from './medical.service';
import {
  CreateMedicalDto,
  CreateMedicalSchema,
} from './dto/create-medical.dto';
import {
  UpdateMedicalDto,
  UpdateMedicalSchema,
} from './dto/update-medical.dto';
import { QueryMedicalDTO, QueryMedicalSchema } from './dto/query-medical.dto';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

@Controller('medical')
export class MedicalController {
  constructor(private readonly medicalService: MedicalService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateMedicalSchema))
    createMedicalDto: CreateMedicalDto,
  ) {
    return this.medicalService.create(createMedicalDto);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query(new ZodValidationPipe(QueryMedicalSchema))
    query: QueryMedicalDTO,
  ) {
    return this.medicalService.findAll(query);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.medicalService.findOne(id);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateMedicalSchema))
    updateMedicalDto: UpdateMedicalDto,
  ) {
    return this.medicalService.update(id, updateMedicalDto.assetIds);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicalService.remove(id);
  }
}
