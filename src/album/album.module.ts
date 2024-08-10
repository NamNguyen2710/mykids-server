import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Albums } from './entities/album.entity';

import { AssetModule } from 'src/asset/asset.module';
import { UsersModule } from 'src/users/users.module';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports: [
    AssetModule,
    UsersModule,
    ClassModule,
    TypeOrmModule.forFeature([Albums]),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
