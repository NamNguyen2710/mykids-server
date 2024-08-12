import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Albums } from './entities/album.entity';

import { UsersModule } from 'src/users/users.module';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [UsersModule, ClassModule, TypeOrmModule.forFeature([Albums])],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
