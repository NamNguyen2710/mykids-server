import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/entity/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppClient } from './entities/client.entity';
import { Role } from './users/entity/roles.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PostModule } from './post/post.module';
import { PostInfo } from './entities/post_info.entity';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { HashTag } from './entities/hashtag.entity';
import { Image } from './entities/image.entity';

@Module({
  imports: [UsersModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Jackson',
      database: 'postgres',
      entities: [
        Users,
        AppClient,
        Role,
        PostInfo,
        Like,
        Comment,
        HashTag,
        Image
      ],
      synchronize: true,
      autoLoadEntities: false,
    }),
    ThrottlerModule.forRoot([{
      ttl: 30000,
      limit: 3,
    }]),
    PostModule,
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [typeorm]
    // }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
    // }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
