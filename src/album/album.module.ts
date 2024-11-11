import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Albums } from './entities/album.entity';

import { ClassModule } from 'src/class/class.module';
import { BaseNotificationModule } from 'src/base-notification/base-notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Albums]),
    ClassModule,
    BaseNotificationModule,
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
