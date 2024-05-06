import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppClient } from 'src/entities/client.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { Role } from 'src/users/entity/roles.entity';
// import { PassportModule } from '@nestjs/passport';
// import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       secret: config.get<string>('JWT_SECRET'),
    //       signOptions: {
    //         expiresIn: config.get<string | number>('JWT_EXPIRES'),
    //       },
    //     };
    //   },
    // }),
    UsersModule,
    TypeOrmModule.forFeature([AppClient, Role]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: 300 },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
