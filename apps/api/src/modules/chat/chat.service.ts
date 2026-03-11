import { PrismaService } from '@message-management/db';
import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { MessageService } from '../message/message.service';
import { ConversationService } from '../conversation/conversation.service';
import { MessageType, SenderType } from '@message-management/types';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly socketGateway: SocketGateway
  ) {}

  async handleStartConversation(userId: string, welcomeMessageFromBot: string) {
    const conversation =
      await this.conversationService.getOrCreateConversation(userId);
    // console.log('Handle start conversation: ', newConversation);

    await this.messageService.addMessageIntoConversation(conversation.id, {
      content: '/start',
      type: MessageType.TEXT,
      senderType: SenderType.INCOMING,
      sentByAdmin: false,
      conversationId: conversation.id,
    });

    const botMessage = await this.messageService.addMessageIntoConversation(
      conversation.id,
      {
        content: welcomeMessageFromBot,
        type: MessageType.TEXT,
        senderType: SenderType.OUTGOING,
        sentByAdmin: false,
        conversationId: conversation.id,
      },
    );

    await this.conversationService.updateConversation(conversation.id, {
      lastMessageId: botMessage.id,
      lastMessageAt: new Date(),
    });

    const detailConversation = await this.conversationService.getDetailConversation(conversation.id)

    // emit socket event
    this.socketGateway.socketHandleUpdateConversation({
      id: detailConversation.id,
      telegramUser: detailConversation.telegramUser,
      isReadByAdmin: detailConversation.isReadByAdmin,
      lastMessage: {
        ...detailConversation.lastMessage,
        sentbyAdmin: detailConversation.lastMessage.sentByAdmin
      },
      lastMessageAt: detailConversation.lastMessageAt.toISOString(),
      status: detailConversation.status
    })
  }
}
