import { PartialType } from '@nestjs/mapped-types';
import { CreateClassHistoryDto } from './create-class-history.dto';

export class UpdateClassHistoryDto extends PartialType(CreateClassHistoryDto) {}
