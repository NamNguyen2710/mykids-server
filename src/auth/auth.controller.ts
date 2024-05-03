import { Controller, Get, Post, Body, UseGuards, Request, Param, Header } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
// import { LoginGuard } from 'src/guard/login.guard';
import { VerifyDTO } from './dto/verify.dto';
import { AuthGuard } from 'src/guard/auth.guard';
// import { Throttle } from '@nestjs/throttler';

@Controller('login')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  // Input number login (localhost:3000/login)
  @Post()
  async login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }

  // Verify otp (localhost:3000/login/verify-otp)
  @Post('verify-otp')
  async verify(@Body() verifyDto: VerifyDTO, @Request() req){
    return this.authService.verify_otp(verifyDto, req);
  }

  //  Verify otp GET (localhost:3000/login/profile)
  @Get('profile')
  @UseGuards(AuthGuard)
  async token(@Request() req){
    return this.authService.getUserProfile(req);
  }
}
