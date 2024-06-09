import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import typeorm from './typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ImageModule } from './image/image.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { CommentModule } from './comment/comment.module';
import { SchoolModule } from './school/school.module';
import { PostModule } from './post/post.module';
import { CommentTaggedUserModule } from './comment_tagged_user/comment_tagged_user.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from './schedule/schedule.module';
import { MenuModule } from './menu/menu.module';
import { ClassModule } from './class/class.module';
import { StudentModule } from './student/student.module';
import { SchoolYearModule } from './school-year/school-year.module';
import { ClassHistoryModule } from './class-history/class-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    ThrottlerModule.forRoot([{ ttl: 3000, limit: 3 }]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
    }),

    UsersModule,
    AuthModule,
    ImageModule,

    SchoolModule,
    SchoolYearModule,
    ClassModule,
    ClassHistoryModule,
    StudentModule,

    PostModule,
    CommentModule,
    CommentTaggedUserModule,
    HashtagModule,

    ScheduleModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
