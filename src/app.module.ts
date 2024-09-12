import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import typeorm from './typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssetModule } from './asset/asset.module';
import { CommentModule } from './comment/comment.module';
import { SchoolModule } from './school/school.module';
import { PostModule } from './post/post.module';
import { ScheduleModule } from './schedule/schedule.module';
import { MenuModule } from './menu/menu.module';
import { ClassModule } from './class/class.module';
import { StudentModule } from './student/student.module';
import { SchoolYearModule } from './school-year/school-year.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { LoaModule } from './loa/loa.module';
import { ProfileModule } from 'src/profile/profile.module';
import { AlbumModule } from './album/album.module';
import { MedicalModule } from 'src/medical/medical.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    ThrottlerModule.forRoot([{ ttl: 3000, limit: 100 }]),
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
    ProfileModule,
    AssetModule,

    SchoolModule,
    SchoolYearModule,
    ClassModule,

    StudentModule,
    LoaModule,
    MedicalModule,

    PostModule,
    CommentModule,

    ScheduleModule,
    MenuModule,
    NotificationsModule,
    AlbumModule,
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
