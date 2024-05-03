import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { VerifyDTO } from './dto/verify.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppClient } from 'src/entities/client.entity';
import { Repository } from 'typeorm';
import { AppDTO } from './dto/app.dto';
import { Request } from 'express';
import { jwtDecode } from 'jwt-decode';
import * as otp_generator from "otp-generator"

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(AppClient)
    private readonly appClientRep: Repository<AppClient>
  ){}

  // Check for phone number before creating otp
  async login(createUserDto: CreateUserDto){
    const user = await this.userService.findOneByNumber(createUserDto.number);

    if(!user){
      throw new NotFoundException('User does not exist!');
    }

    const otp = otp_generator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    console.log(`otp: ${otp}`);
    this.userService.update(user.id, {otp: otp});
    return { msg: 'Please Verify OTP to finish logging in' };
  }

  // Verifying the otp
  async verify_otp(verifyDto: VerifyDTO, req: Request){
    const user = await this.userService.findOneByNumber(verifyDto.number);
    
    if (verifyDto.otp !== user.otp){
      throw new UnauthorizedException();
    }
    this.userService.update(user.id, {otp: null});
    const payload = { sub: user.id, role: user.role.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
      // expireIn: `${await this.checkApp(data)}`
    };
  }

  // Before getting the profile we need to verify the token
  async getUserProfile(req: Request){
    // console.log(req);
    // console.log(req['user']);

    const userID = req['user'];

    const user = this.userService.findOne(userID);
    return user;
  }
  
  // Get access token
  // private extractTokenFromHeader(request: Request): string[] | undefined {
  //   const array = request.headers.authorization?.split(' ') ?? [];
  //   return array;
  // }

  // Check for app id 
  async checkApp(appDto: AppDTO){
    const app = await this.appClientRep.findOne({where: { id: appDto.id.toString() }});

    if (!app){
      throw new Error('Interal error');
    }
    return app.expireIn;
  }
}
