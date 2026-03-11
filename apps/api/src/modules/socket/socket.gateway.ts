import { Conversation } from '@message-management/types';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }
  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);
  }

  socketHandleUpdateConversation(conversationData: Conversation) {
    this.server.emit('conversation_updated', {
      conversation: conversationData,
    });
  }
}
