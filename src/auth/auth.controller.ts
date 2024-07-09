import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ClientGuard } from 'src/guard/client.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import { VerifyDTO, VerifySchema } from './dto/verify.dto';
import { LoginDto, LoginSchema } from './dto/login.dto';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ClientGuard)
  @Post()
  async login(
    @Request() req,
    @Body(new ZodValidationPipe(LoginSchema)) loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto, req.client);
  }

  @UseGuards(ClientGuard)
  @Post('verify-otp')
  async verify(
    @Body(new ZodValidationPipe(VerifySchema)) verifyDto: VerifyDTO,
    @Request() req,
  ) {
    return this.authService.verifyOtp(verifyDto, req.client);
  }
}
