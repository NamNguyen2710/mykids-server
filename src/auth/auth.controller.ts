import {
  Controller,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
  BadRequestException,
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

import { GRANT_TYPE } from 'src/auth/entities/grant_type.data';
import { RequestWithClient } from 'src/utils/request-with-client';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ClientGuard)
  @Post()
  async login(
    @Request() req: RequestWithClient,
    @Body(new ZodValidationPipe(LoginSchema)) loginDto: LoginDto,
  ) {
    if (loginDto.grantType === GRANT_TYPE.OTP) {
      return this.authService.requestOtp(loginDto, req.client);
    } else if (loginDto.grantType === GRANT_TYPE.PASSWORD) {
      return this.authService.verifyPassword(
        loginDto.email,
        loginDto.password,
        req.client,
      );
    }

    throw new BadRequestException('Invalid grant type');
  }

  @UseGuards(ClientGuard)
  @Post('verify-otp')
  async verify(
    @Body(new ZodValidationPipe(VerifyLoginOTPSchema))
    verifyDto: VerifyLoginOTPDTO,
    @Request() req: RequestWithClient,
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
