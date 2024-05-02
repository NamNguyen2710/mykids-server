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
// import { jwtDecode } from 'jwt-decode';
import { Request } from 'express';
import { JwtPayload, jwtDecode } from 'jwt-decode';
// import { Users } from 'src/users/entity/users.entity';
import { Role } from 'src/users/entity/roles.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(AppClient)
    private readonly appClientRep: Repository<AppClient>,
    @InjectRepository(Role)
    private readonly roleRep: Repository<Role>
  ){}

  // Check for phone number before creating otp
  async login(createUserDto: CreateUserDto){
    const user = await this.userService.findOneByNumber(createUserDto.number);
    const otp_generator = require('otp-generator');

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
    const basic = this.extractTokenFromHeader(req);
    if (basic[0] !== 'Basic'){
      throw new BadRequestException;
    }
    // console.log(user)
    // const he = this.jwtService.sign({sub: user.id, role: user.role.name});
    // const p = await jwtDecode(he) as JwtPayload;

    // console.log(p);
    const data: AppDTO = await jwtDecode(basic[1]);

    if (verifyDto.otp !== user.otp){
      throw new UnauthorizedException();
    }
    this.userService.update(user.id, {otp: null});
    const payload = { sub: user.id};

    return {
      access_token: await this.jwtService.signAsync(payload),
      expireIn: `${await this.checkApp(data)}`
    };
  }

  // Before getting the profile we need to verify the token
  async verifyToken(req: Request){
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
          token[1],
          {
          secret: jwtConstants.secret
          }
      );
      console.log(payload);
      const user = this.userService.findOneByNumber(payload.sub);
      return user;
    }
      catch {
        throw new UnauthorizedException();
    }
  }
  
  // Get access token
  private extractTokenFromHeader(request: Request): string[] | undefined {
    const array = request.headers.authorization?.split(' ') ?? [];
    return array;
  }

  // Check for app id 
  async checkApp(appDto: AppDTO){
    const app = await this.appClientRep.find();
    for (let i = 0; i < app.length; i++){
      if (app[i].id === appDto.id.toString() && app[i].secret === appDto.secret){
        return app[i].expireIn;
      }
    }
    throw new Error('Interal error');
  }
}
