import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
} from '@nestjs/class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  readonly schoolId: number;

  @IsOptional()
  @IsNumber()
  readonly classId?: number;

  @IsOptional()
  @IsNumber()
  readonly studentId?: number;

  @IsNotEmpty()
  readonly createdById: number;

  @IsOptional()
  @IsDateString()
  readonly publishedDate?: string;
}
