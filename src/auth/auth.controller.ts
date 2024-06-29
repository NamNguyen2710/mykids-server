import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
// import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { VerifyDTO } from './dto/verify.dto';
import { ClientGuard } from 'src/guard/client.guard';
import { LoginDto } from './dto/login.dto';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(ClientGuard)
  @Post('verify-otp')
  async verify(@Body() verifyDto: VerifyDTO, @Request() req) {
    return this.authService.verifyOtp(verifyDto, req.client);
  }
}
