import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ClientGuard } from 'src/guard/client.guard';

import { VerifyDTO, VerifySchema } from './dto/verify.dto';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body(new ZodValidationPipe(LoginSchema)) loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
