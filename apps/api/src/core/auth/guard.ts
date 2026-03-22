import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../decorator/custom.decorator';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TokenPayload } from '@message-management/types';
import { PrismaService } from '@message-management/db';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;
    if (isPublic) return true;

    const request = context
      .switchToHttp()
      .getRequest<{ token_secret?: string }>();

    const tokenRequest = request['token_secret'];
    if (!tokenRequest) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const payload = this.jwtService.verify<TokenPayload>(
        tokenRequest,
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        },
      );

      request['user'] = {
        id: payload.accountId
      }

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Access token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
