import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ClientGuard } from 'src/guard/client.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import { VerifyDTO, VerifySchema } from './dto/verify.dto';
import { LoginDto, LoginSchema } from './dto/login.dto';

@Controller('login')
@UseGuards(ClientGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(
    @Request() req,
    @Body(new ZodValidationPipe(LoginSchema)) loginDto: LoginDto,
  ) {
    return this.authService.requestOtp(loginDto, req.client);
  }

  @Post('verify-otp')
  async verify(
    @Body(new ZodValidationPipe(VerifySchema)) verifyDto: VerifyDTO,
    @Request() req,
  ) {
    return this.authService.verifyOtp(verifyDto, req.client);
  }
}
