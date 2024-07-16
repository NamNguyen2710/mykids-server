import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Images } from './entities/image.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Images])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
