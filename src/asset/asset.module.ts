import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { Assets } from './entities/asset.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Assets])],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
