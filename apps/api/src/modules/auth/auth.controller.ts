import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PUBLIC } from '../../core/decorator/custom.decorator';
import { LoginDto, LogoutDto, RefreshTokenDto, RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  getMeController(
    @Req() req: Request & { user: { id: string; email: string } },
  ) {
    return req.user;
  }

  @PUBLIC()
  @Post('login')
  async loginController(@Body() payload: LoginDto) {
    return this.authService.login(payload.email, payload.password);
  }

  @PUBLIC()
  @Post('register')
  async registerController(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @PUBLIC()
  @Post('refresh')
  async refreshTokenController(@Body() payload: RefreshTokenDto) {
    return this.authService.refreshToken(payload.token);
  }

  @PUBLIC()
  @Post('logout')
  logoutController(@Body() payload: LogoutDto) {
    return this.authService.logout(payload.token);
  }
}
