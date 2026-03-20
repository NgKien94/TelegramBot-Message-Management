import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth?.token;
    console.log("Token: ",token);

    if (!token) throw new WsException('No token provided');

    try {
      this.jwtService.verify(token,{
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
      });
      return true;
    } catch {
      client.disconnect()
      console.log("Websocket guard log...");
      throw new WsException('Invalid token');
    }
  }
}
