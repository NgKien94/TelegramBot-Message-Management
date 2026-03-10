import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [ConversationModule, MessageModule],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
