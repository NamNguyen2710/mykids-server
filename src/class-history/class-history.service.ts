import { Injectable } from '@nestjs/common';
import { CreateClassHistoryDto } from './dto/create-class-history.dto';
import { UpdateClassHistoryDto } from './dto/update-class-history.dto';

@Injectable()
export class ClassHistoryService {
  create(createClassHistoryDto: CreateClassHistoryDto) {
    return 'This action adds a new classHistory';
  }

  findAll() {
    return `This action returns all classHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classHistory`;
  }

  update(id: number, updateClassHistoryDto: UpdateClassHistoryDto) {
    return `This action updates a #${id} classHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} classHistory`;
  }
}
