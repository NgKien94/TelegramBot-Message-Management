import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtModule } from '@nestjs/jwt';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [JwtModule, MessageModule],
  providers: [SocketGateway],
  exports: [SocketGateway]
})
export class SocketModule {}
