import {
  Controller,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ClientGuard } from 'src/guard/client.guard';
import { ZodValidationPipe } from 'src/utils/zod-validation-pipe';

import {
  VerifyLoginOTPDTO,
  VerifyLoginOTPSchema,
} from './dto/verifyLoginOtp.dto';
import {
  VerifyResetOTPDTO,
  VerifyResetOTPSchema,
} from 'src/auth/dto/verifyResetOtp.dto';
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
    return this.authService.requestOtp(loginDto, req.client);
  }

  @UseGuards(ClientGuard)
  @Post('verify-otp')
  async verify(
    @Body(new ZodValidationPipe(VerifyLoginOTPSchema))
    verifyDto: VerifyLoginOTPDTO,
    @Request() req,
  ) {
    return this.authService.verifyLoginOtp(verifyDto, req.client);
  }

  @Put('reset-password')
  async resetPassword(
    @Body(new ZodValidationPipe(VerifyResetOTPSchema))
    verifyReset: VerifyResetOTPDTO,
  ) {
    return this.authService.verifyResetPasswordOtp(verifyReset);
  }
}
