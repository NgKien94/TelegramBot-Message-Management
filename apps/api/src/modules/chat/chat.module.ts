import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageModule } from '../message/message.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [ConversationModule, MessageModule, SocketModule],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
