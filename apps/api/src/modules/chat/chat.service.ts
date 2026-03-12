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
    private readonly socketGateway: SocketGateway,
  ) {}

  async handleStartConversation(userId: string, welcomeMessageFromBot: string) {
    // get existing conversation or create it
    const conversation = await this.conversationService.getOrCreateConversation(userId);
    // console.log('Handle start conversation: ', newConversation);
    // add message from Telegram user into conversation
    const userMessage = await this.messageService.addMessageIntoConversation(conversation.id, {
      content: '/start',
      type: MessageType.TEXT,
      senderType: SenderType.INCOMING,
      sentByAdmin: false,
      conversationId: conversation.id,
    });

    // add message from the bot into conversation
    const botMessage = await this.messageService.addMessageIntoConversation(conversation.id, {
      content: welcomeMessageFromBot,
      type: MessageType.TEXT,
      senderType: SenderType.OUTGOING,
      sentByAdmin: false,
      conversationId: conversation.id,
    });

    // update conversation (lastMessage)
    await this.conversationService.updateConversation(conversation.id, {
      lastMessageId: botMessage.id,
      lastMessageAt: new Date(),
    });

    const detailConversation = await this.conversationService.getDetailConversation(conversation.id);

    // emit socket event for web frontend to realtime conversation
    this.socketGateway.socketHandleUpdateConversation({
      id: detailConversation.id,
      telegramUser: detailConversation.telegramUser,
      isReadByAdmin: detailConversation.isReadByAdmin,
      lastMessage: {
        ...detailConversation.lastMessage,
        sentbyAdmin: detailConversation.lastMessage.sentByAdmin,
      },
      lastMessageAt: detailConversation.lastMessageAt.toISOString(),
      status: detailConversation.status,
    });

    // emit socket event for web frontend to realtime chat history
    this.socketGateway.socketHandleUpdateChatHistory([
      { ...userMessage, createdAt: userMessage.createdAt.toISOString() },
      { ...botMessage, createdAt: botMessage.createdAt.toISOString() },
    ]);
  }

  async handleTelegramUserSendMessage(userId: string, content: string) {
    // get conversation by userId
    const conversation = await this.conversationService.getOrCreateConversation(userId);

    // add newest message from Telegram user
    const newMessage = await this.messageService.addMessageIntoConversation(conversation.id, {
      content,
      type: MessageType.TEXT,
      senderType: SenderType.INCOMING,
      sentByAdmin: false,
      conversationId: conversation.id,
    });

    // update conversation
    await this.conversationService.updateConversation(conversation.id, {
      lastMessageId: newMessage.id,
      lastMessageAt: new Date(),
    });

    // get detail conversation
    const detailConversation = await this.conversationService.getDetailConversation(conversation.id);

    // emit socket event for web frontend to realtime conversation
    this.socketGateway.socketHandleUpdateConversation({
      id: detailConversation.id,
      telegramUser: detailConversation.telegramUser,
      isReadByAdmin: detailConversation.isReadByAdmin,
      lastMessage: {
        ...detailConversation.lastMessage,
        sentbyAdmin: detailConversation.lastMessage.sentByAdmin,
      },
      lastMessageAt: detailConversation.lastMessageAt.toISOString(),
      status: detailConversation.status,
    });

    // emit socket event for web frontend to realtime chat history
    this.socketGateway.socketHandleUpdateChatHistory([
      { ...newMessage, createdAt: newMessage.createdAt.toISOString() },
    ]);
  }
}
