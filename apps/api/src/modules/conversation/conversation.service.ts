import { PrismaService } from '@message-management/db';
import { Injectable, NotFoundException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { UpdateConversationDto } from './conversation.dto';
import { Conversation } from '@message-management/types';

@Injectable()
export class ConversationService {
  constructor(private readonly prismaService: PrismaService) {}

  async getConversationsList() {
    const conversations = await this.prismaService.conversation.findMany({
      // where: {
      //   status: 'OPEN'
      // }
      include: {
        telegramUser: true,
      },
      orderBy: [{ lastMessageAt: 'desc' }, { updatedAt: 'desc' }],
    });

    const listMessageId = conversations.map((item) => item.lastMessageId);

    const messages = await this.prismaService.message.findMany({
      where: {
        id: { in: listMessageId },
      },
    });

    const mapMessages = new Map(
      messages.map((message) => [message.id, message]),
    );
    const result = conversations.map((conversation) => {
      return {
        ...conversation,
        lastMessage: mapMessages.get(conversation.lastMessageId),
      };
    });
    return result;
  }

  async getDetailConversation(conversationId: string) {
    const conversation = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        telegramUser: true,
      },
    });

    const lastMessage = await this.prismaService.message.findUnique({
      where: {
        id: conversation.lastMessageId,
      },
    });

    return {
      lastMessage,
      ...conversation,
    };
  }

  async getOrCreateConversation(userId: string) {
    const isExistConversationWithUser =
      await this.prismaService.conversation.findUnique({
        where: {
          userId,
        },
      });

    if (isExistConversationWithUser) {
      // // User has had a conversation
      // console.log("Exit conversation: ",isExistConversationWithUser)
      return isExistConversationWithUser;
    }

    const newConversation = await this.prismaService.conversation.create({
      data: {
        userId,
        status: 'OPEN',
        isReadByAdmin: false,
      },
    });

    // console.log("New conversation: ", newConversation);

    return newConversation;
  }

  async updateConversation(
    conversationId: string,
    payload: UpdateConversationDto,
  ) {
    const isExistConversation =
      await this.prismaService.conversation.findUnique({
        where: {
          id: conversationId,
        },
      });

    if (!isExistConversation) {
      throw new NotFoundException('Conversation not found');
    }

    await this.prismaService.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        userId: payload.userId,
        isReadByAdmin: payload.isReadByAdmin,
        status: payload.status,
        lastMessageId: payload.lastMessageId,
        lastMessageAt: payload.lastMessageAt,
        updatedAt: new Date(),
      },
    });
  }

  async getChatHistoryOfConversation(conversationId: string) {
    const isExistConversation =
      await this.prismaService.conversation.findUnique({
        where: {
          id: conversationId,
        },
      });

    if (!isExistConversation) {
      throw new NotFoundException('Conversation not found');
    }

    const result = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        telegramUser: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return result;
  }
}
