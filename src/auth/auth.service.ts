import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/users/users.service';
import { VerifyLoginOTPDTO } from './dto/verifyLoginOtp.dto';
import { VerifyResetOTPDTO } from 'src/auth/dto/verifyResetOtp.dto';
import { AppClients } from 'src/auth/entities/client.entity';
import { OTP_EXPIRES_IN } from 'src/utils/constants';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(AppClients)
    private readonly clientRepo: Repository<AppClients>,
  ) {}

  // Verify the user and send OTP
  async requestOtp(loginDto: LoginDto, client: AppClients) {
    const user = await this.userService.findOneByPhone(loginDto.phoneNumber);
    if (!user) throw new NotFoundException('User does not exist!');
    if (user.role.clients.every((cl) => cl.clientId !== client.id))
      throw new UnauthorizedException('Invalid client');

    const otpNum = Math.floor(Math.random() * 1000000);
    const otp = otpNum.toString().padStart(6, '0');

    console.log('OTP:', user.phoneNumber, otp);
    this.userService.update(user.id, {
      otp,
      otpExpiresAt: new Date(Date.now() + OTP_EXPIRES_IN * 1000),
    });
    return { message: 'Please Verify OTP to finish logging in' };
  }

  async verifyLoginOtp(verifyDto: VerifyLoginOTPDTO, client: AppClients) {
    const user = await this.userService.findOneByPhone(verifyDto.phoneNumber);
    if (!user) throw new NotFoundException('User does not exist!');
    if (user.role.clients.every((cl) => cl.clientId !== client.id))
      throw new UnauthorizedException('Invalid client');

    if (verifyDto.otp !== user.otp)
      throw new UnauthorizedException('Invalid OTP');
    if (Date.now() > user.otpExpiresAt.getTime())
      throw new UnauthorizedException('OTP expired');

    this.userService.update(user.id, { otp: null });
    const payload: JwtPayload = { role: user.role.name, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: client.expiresIn,
      }),
      expires_in: client.expiresIn,
    };
  }

  async verifyPassword(username: string, password: string, client: AppClients) {
    const user = await this.userService.findOneByEmail(username);
    if (!user) throw new NotFoundException('Invalid username');
    if (user.role.clients.every((cl) => cl.clientId !== client.id))
      throw new UnauthorizedException('Invalid client');

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Invalid password');

    const payload: JwtPayload = { role: user.role.name, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      expires_in: client.expiresIn,
    };
  }

  async resetPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) return { message: 'Please Verify OTP to reset password' };

    const otpNum = Math.floor(Math.random() * 1000000);
    const otp = otpNum.toString().padStart(6, '0');

    console.log('OTP:', user.email, otp);
    this.userService.update(user.id, {
      otp,
      otpExpiresAt: new Date(Date.now() + OTP_EXPIRES_IN * 1000),
    });
    return { message: 'Please Verify OTP to reset password' };
  }

  async verifyResetPasswordOtp(verifyDto: VerifyResetOTPDTO) {
    const user = await this.userService.findOneByEmail(verifyDto.email);
    if (!user) throw new NotFoundException('User does not exist!');

    if (verifyDto.otp !== user.otp)
      throw new UnauthorizedException('Invalid OTP');
    if (Date.now() > user.otpExpiresAt.getTime())
      throw new UnauthorizedException('OTP expired');

    const hashPassword = await bcrypt.hash(verifyDto.password, 10);

    const res = await this.userService.update(user.id, {
      otp: null,
      password: hashPassword,
    });
    if (!res)
      throw new InternalServerErrorException('Failed to reset password');

    return { message: 'Please login again using your new password' };
  }

  async findClient(clientId: string, clientSecret: string) {
    const client = await this.clientRepo.findOne({
      where: { id: clientId, secret: clientSecret },
    });

    if (!client) throw new UnauthorizedException();
    return client;
  }
}
