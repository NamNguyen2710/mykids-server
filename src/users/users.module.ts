import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { PostService } from 'src/post/post.service';
import { Posts } from 'src/post/entities/post.entity';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Users, Posts])],
  controllers: [UsersController],
  providers: [UserService, PostService],
  exports: [UserService],
})
export class UsersModule {}
