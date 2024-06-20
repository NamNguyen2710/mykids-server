import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from 'src/users/users.service';
import { VerifyDTO } from './dto/verify.dto';
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
  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByPhone(loginDto.number);
    if (!user) throw new NotFoundException('User does not exist!');

    const otpNum = Math.floor(Math.random() * 1000000);
    const otp = otpNum.toString().padStart(6, '0');

    console.log('OTP:', user.phoneNumber, otp);
    this.userService.update(user.id, {
      otp,
      otpExpiresAt: new Date(Date.now() + OTP_EXPIRES_IN * 1000),
    });
    return { msg: 'Please Verify OTP to finish logging in' };
  }

  async verifyOtp(verifyDto: VerifyDTO, client: AppClients) {
    const user = await this.userService.findOneByPhone(verifyDto.phoneNumber);
    if (!user) throw new NotFoundException('User does not exist!');

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

  async findClient(clientId: string, clientSecret: string) {
    const client = await this.clientRepo.findOne({
      where: { id: clientId, secret: clientSecret },
    });

    if (!client) throw new UnauthorizedException();
    return client;
  }
}
