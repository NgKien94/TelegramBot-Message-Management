import { PrismaService } from '@message-management/db';
import { Injectable, NotFoundException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import {
  UpdateConversationDto,
} from './conversation.dto';

@Injectable()
export class ConversationService {
  constructor(private readonly prismaService: PrismaService) {}

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

    return newConversation
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
}
