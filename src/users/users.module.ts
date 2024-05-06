import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { PostModule } from 'src/post/post.module';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule, 
    TypeOrmModule.forFeature([Users]),
    PostModule,
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService]
})
export class UsersModule {}