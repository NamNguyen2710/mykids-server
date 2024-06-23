import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LoaService } from './loa.service';
// import { CreateLoaDto } from './dto/create-loa.dto';
import { LoginGuard } from 'src/guard/login.guard';

@UseGuards(LoginGuard)
@Controller('loa')
export class LoaController {
  constructor(private readonly loaService: LoaService) {}

  // @Post()
  // create(@Body() createLoaDto: CreateLoaDto) {
  //   return this.loaService.create(createLoaDto);
  // }

  @Get('class')
  findClassLOA(@Request() request, @Query() query): Promise<any> {
    console.log(query);
    return this.loaService.findClassLOA(request.user.sub, {
      classId: query.classId ? parseInt(query.classId) : null,
      take: query.limit ? parseInt(query.limit) : 10,
      page: query.page ? parseInt(query.page) : 0,
    });
  }

  @Get(':loaID')
  findOneLOA(@Request() request, @Param('loaID') loaID: number) {
    return this.loaService.findOneLoa(request.user.sub, loaID);
  }

  @Get('student/:studentId')
  findStudentLOA(@Request() request, @Query() query) {
    return this.loaService.findChildrenLOA(request.user.sub, {
      studentId: query.studentId ? parseInt(query.studentId) : null,
      take: query.limit ? parseInt(query.limit) : 10,
      page: query.page ? parseInt(query.page) : 0,
    });
  }

  // @Delete(':loaID')
  // deleteLOA(@Param('id') id: string) {
  //   return this.loaService.remove(+id);
  // }
}
