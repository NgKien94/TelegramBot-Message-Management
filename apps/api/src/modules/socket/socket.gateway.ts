import { Conversation, Messages } from '@message-management/types';
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../../core/auth/socket.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WebSocketExceptionFilter } from '../../core/filter/socket.exception-filter';

@UsePipes(
  new ValidationPipe({
    whitelist: true, // remove fields not in dto
    transform: true, // transform string -> number
    transformOptions: {
      enableImplicitConversion: true, // transform string 'true' -> true
    },
  }),
)
@UseFilters(new WebSocketExceptionFilter())
@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }
  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;

    if (!token) {
      console.log('No token, disconnecting:', client.id);
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });

      console.log('Payload - client connected: ', payload);
    } catch {
      console.log('Invalid token, disconnecting:', client.id);
      client.disconnect();
      return;
    }
    console.log('Client connected: ', client.id);
  }

  socketHandleUpdateConversation(conversationData: Conversation) {
    this.server.emit('conversation_updated', {
      conversation: conversationData,
    });
  }

  socketHandleUpdateChatHistory(messages: Messages[]) {
    this.server.emit('new_messages', {
      newMessages: messages,
    });
  }

  // @SubscribeMessage('create_message')
  // socketHandleReceiveMessage(@MessageBody() data: CreateMessageInGatewayDto) {
  //   console.log("==============================");
  //   console.log("Run here");
  //   console.log("==============================");
  //   this.messageService.addMessageIntoConversation(data.conversationId,data)
  // }
}
