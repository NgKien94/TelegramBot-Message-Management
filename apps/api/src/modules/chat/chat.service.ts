import { PrismaService } from '@message-management/db';
import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { MessageService } from '../message/message.service';
import { ConversationService } from '../conversation/conversation.service';
import { MessageType, SenderType } from '@message-management/types';

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
  ) {}

  async handleStartConversation(userId: string, welcomeMessageFromBot: string) {
    const newConversation =
      await this.conversationService.getOrCreateConversation(userId);
    // console.log('Handle start conversation: ', newConversation);

    await this.messageService.addMessageIntoConversation(newConversation.id, {
      content: '/start',
      type: MessageType.TEXT,
      senderType: SenderType.INCOMING,
      sentByAdmin: false,
      conversationId: newConversation.id,
    });

    const botMessage = await this.messageService.addMessageIntoConversation(
      newConversation.id,
      {
        content: welcomeMessageFromBot,
        type: MessageType.TEXT,
        senderType: SenderType.OUTGOING,
        sentByAdmin: false,
        conversationId: newConversation.id,
      },
    );

    await this.conversationService.updateConversation(newConversation.id, {
      lastMessageId: botMessage.id,
      lastMessageAt: new Date(),
    });
  }
}
