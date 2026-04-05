import { PrismaService } from '@message-management/db';
import { Injectable, NotFoundException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { GetConversationDto, UpdateConversationDto } from './conversation.dto';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class ConversationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async getConversationsList(filter: GetConversationDto) {
    const conversations = await this.prismaService.conversation.findMany({
      where: {
        status: filter.status,
        telegramUser: {
          username: filter.search
            ? {
                contains: filter.search,
                mode: 'insensitive',
              }
            : undefined,
        },
      },
      include: {
        telegramUser: true,
        lastMessage: {
          include: {
            account: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ lastMessageAt: 'desc' }, { updatedAt: 'desc' }],
    });

    return conversations.map((conv) => ({
      ...conv,
      lastMessage: conv.lastMessage
        ? {
            ...conv.lastMessage,
            sentByAdmin: conv.lastMessage.account,
            account: undefined,
          }
        : null,
    }));
  }

  async getDetailConversation(conversationId: string) {
    const conversation = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        telegramUser: true,
        lastMessage: true,
      },
    });

    return conversation;
  }

  async getOrCreateConversation(userId: string) {
    const existConversationWithUser = await this.prismaService.conversation.findUnique({
      where: {
        userId,
      },
    });

    if (existConversationWithUser) {
      // User has had a conversation
      return existConversationWithUser;
    }

    const newConversation = await this.prismaService.conversation.create({
      data: {
        userId,
        status: 'OPEN',
        isReadByAdmin: false,
      },
    });

    return newConversation;
  }

  async updateConversationInternal(conversationId: string, payload: UpdateConversationDto) {
    const existConversation = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!existConversation) {
      throw new NotFoundException('Conversation not found');
    }

    const updatedConversation = await this.prismaService.conversation.update({
      where: {
        id: conversationId,
      },
      include: {
        telegramUser: true,
        lastMessage: {
          include: {
            account: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      data: {
        isReadByAdmin: payload.isReadByAdmin,
        status: payload.status,
        lastMessageId: payload.lastMessageId,
        lastMessageAt: payload.lastMessageAt,
        updatedAt: new Date(),
      },
    });

    return updatedConversation;
  }

  async adminUpdateConversation(conversationId: string, payload: UpdateConversationDto) {
    const updatedConversation = await this.updateConversationInternal(conversationId, payload);

    this.socketGateway.newSocketHandle({
      conversation: {
        id: updatedConversation.id,
        isReadByAdmin: updatedConversation.isReadByAdmin
      }
    })

    return updatedConversation;
  }

  async getChatHistoryOfConversation(conversationId: string) {
    const existConversation = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!existConversation) {
      throw new NotFoundException('Conversation not found');
    }

    const result = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        telegramUser: true,
        messages: {
          include: {
            account: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return {
      ...result,
      messages: result.messages.map((message) => ({
        ...message,
        sentByAdmin: message.account,
        account: undefined,
      })),
    };
  }
}
