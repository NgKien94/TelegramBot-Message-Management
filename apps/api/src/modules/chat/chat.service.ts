import { PrismaService } from '@message-management/db';
import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { MessageService } from '../message/message.service';
import { ConversationService } from '../conversation/conversation.service';
import { ConversationStatus, MessageType, SenderType } from '@message-management/types';
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
    // add message from Telegram user into conversation
    const userMessage = await this.messageService.addMessageIntoConversation(conversation.id, {
      content: '/start',
      type: MessageType.TEXT,
      senderType: SenderType.INCOMING,
      sentByAdmin: undefined,
      conversationId: conversation.id,
    });

    // add message from the bot into conversation
    const botMessage = await this.messageService.addMessageIntoConversation(conversation.id, {
      content: welcomeMessageFromBot,
      type: MessageType.TEXT,
      senderType: SenderType.OUTGOING,
      sentByAdmin: undefined,
      conversationId: conversation.id,
    });

    // update conversation (lastMessage)
    await this.conversationService.updateConversationInternal(conversation.id, {
      isReadByAdmin: false, // Admin don't send message => conversation status is UNREAD
      status: ConversationStatus.OPEN,
      lastMessageId: botMessage.id,
      lastMessageAt: new Date(),
    });

    const detailConversation = await this.conversationService.getDetailConversation(conversation.id);

    // emit socket event for web frontend to realtime conversation
    // old
    // this.socketGateway.socketHandleUpdateConversation({
    //   id: detailConversation.id,
    //   telegramUser: detailConversation.telegramUser,
    //   isReadByAdmin: detailConversation.isReadByAdmin,
    //   lastMessage: {
    //     ...detailConversation.lastMessage,
    //     sentByAdmin: null,
    //   },
    //   lastMessageAt: detailConversation.lastMessageAt.toISOString(),
    //   status: detailConversation.status,
    // });

    // emit socket event for web frontend to realtime chat history

    // old
    // this.socketGateway.socketHandleUpdateChatHistory([
    //   { ...userMessage, sentByAdmin: null, createdAt: userMessage.createdAt.toISOString() },
    //   { ...botMessage, sentByAdmin: null, createdAt: botMessage.createdAt.toISOString() },
    // ]);

    // new
    this.socketGateway.newSocketHandle({
      message: { ...userMessage, sentByAdmin: null, createdAt: userMessage.createdAt.toISOString() },
      conversation: detailConversation,
      telegramUser: detailConversation.telegramUser,
    });

    this.socketGateway.newSocketHandle({
      message: { ...botMessage, sentByAdmin: null, createdAt: userMessage.createdAt.toISOString() },
      conversation: detailConversation,
      telegramUser: detailConversation.telegramUser,
    });
  }

  async handleTelegramUserSendTextMessage(userId: string, content: string) {
    // get conversation by userId
    const conversation = await this.conversationService.getOrCreateConversation(userId);

    // add newest message from Telegram user
    const newMessage = await this.messageService.addMessageIntoConversation(conversation.id, {
      content,
      type: MessageType.TEXT,
      senderType: SenderType.INCOMING,
      sentByAdmin: undefined,
      conversationId: conversation.id,
    });

    // update conversation
    await this.conversationService.updateConversationInternal(conversation.id, {
      isReadByAdmin: false, // Telegram user send messages => conversation status is UNREAD
      status: ConversationStatus.OPEN,
      lastMessageId: newMessage.id,
      lastMessageAt: new Date(),
    });

    // get detail conversation
    const detailConversation = await this.conversationService.getDetailConversation(conversation.id);

    // emit socket event for web frontend to realtime conversation
    // old
    // this.socketGateway.socketHandleUpdateConversation({
    //   id: detailConversation.id,
    //   telegramUser: detailConversation.telegramUser,
    //   isReadByAdmin: detailConversation.isReadByAdmin,
    //   lastMessage: {
    //     ...detailConversation.lastMessage,
    //     sentByAdmin: null,
    //   },
    //   lastMessageAt: detailConversation.lastMessageAt.toISOString(),
    //   status: detailConversation.status,
    // });

    // emit socket event for web frontend to realtime chat history
    // old
    // this.socketGateway.socketHandleUpdateChatHistory([
    //   { ...newMessage, sentByAdmin: null, createdAt: newMessage.createdAt.toISOString() },
    // ]);

    // new
    this.socketGateway.newSocketHandle({
      message: { ...newMessage, sentByAdmin: null, createdAt: newMessage.createdAt.toISOString() },
      conversation: detailConversation,
      telegramUser: detailConversation.telegramUser,
    });
  }

  async handleTelegramUserSendImages(userId: string, fileUrl: string[], content?: string) {
    // get conversation by userId
    const conversation = await this.conversationService.getOrCreateConversation(userId);

    // add newest message from Telegram user
    const newMessage = await this.messageService.addMessageIntoConversation(conversation.id, {
      content,
      fileUrls: [...fileUrl],
      type: MessageType.FILE,
      senderType: SenderType.INCOMING,
      sentByAdmin: undefined,
      conversationId: conversation.id,
    });

    // update conversation
    await this.conversationService.updateConversationInternal(conversation.id, {
      isReadByAdmin: false, // Telegram user send messages => conversation status is UNREAD
      status: ConversationStatus.OPEN,
      lastMessageId: newMessage.id,
      lastMessageAt: new Date(),
    });

    // get detail conversation
    const detailConversation = await this.conversationService.getDetailConversation(conversation.id);

    // emit socket event for web frontend to realtime conversation
    // old
    // this.socketGateway.socketHandleUpdateConversation({
    //   id: detailConversation.id,
    //   telegramUser: detailConversation.telegramUser,
    //   isReadByAdmin: detailConversation.isReadByAdmin,
    //   lastMessage: {
    //     ...detailConversation.lastMessage,
    //     sentByAdmin: null,
    //   },
    //   lastMessageAt: detailConversation.lastMessageAt.toISOString(),
    //   status: detailConversation.status,
    // });

    // emit socket event for web frontend to realtime chat history
    // old
    // this.socketGateway.socketHandleUpdateChatHistory([
    //   { ...newMessage, sentByAdmin: null, createdAt: newMessage.createdAt.toISOString() },
    // ]);

    // new
    this.socketGateway.newSocketHandle({
      message: { ...newMessage, sentByAdmin: null, createdAt: newMessage.createdAt.toISOString() },
      conversation: detailConversation,
      telegramUser: detailConversation.telegramUser,
    });
  }

  async handleSendMessageToTelegramUser(messageId: string) {
    const message = await this.messageService.getMessageDetail(messageId);

    // update conversation
    await this.conversationService.updateConversationInternal(message.conversationId, {
      isReadByAdmin: true, // admin send message => conversation status is READ
      status: ConversationStatus.OPEN,
      lastMessageId: message.id,
      lastMessageAt: new Date(),
    });

    const detailConversation = await this.conversationService.getDetailConversation(message.conversationId);

    // emit socket event for web frontend to realtime conversation
    // old
    // this.socketGateway.socketHandleUpdateConversation({
    //   id: detailConversation.id,
    //   telegramUser: detailConversation.telegramUser,
    //   isReadByAdmin: detailConversation.isReadByAdmin,
    //   lastMessage: {
    //     ...detailConversation.lastMessage,
    //     sentByAdmin: {
    //       id: message.account.id,
    //       name: message.account.name,
    //     },
    //   },
    //   lastMessageAt: detailConversation.lastMessageAt.toISOString(),
    //   status: detailConversation.status,
    // });

    // emit socket event for web frontend to realtime chat history
    // old
    // this.socketGateway.socketHandleUpdateChatHistory([
    //   {
    //     ...message,
    //     sentByAdmin: {
    //       id: message.account.id,
    //       name: message.account.name,
    //     },
    //     createdAt: message.createdAt.toISOString(),
    //   },
    // ]);

    // new
    this.socketGateway.newSocketHandle({
      message: {
        ...message,
        sentByAdmin: {
          id: message.account.id,
          name: message.account.name,
        },
        createdAt: message.createdAt.toISOString(),
      },
      conversation: detailConversation,
      telegramUser: detailConversation.telegramUser,
    });
  }
}
