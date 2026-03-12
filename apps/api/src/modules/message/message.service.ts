import { PrismaService } from '@message-management/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async addMessageIntoConversation(conversationId: string, payload: CreateMessageDto) {
    const isExistConversation = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!isExistConversation) {
      throw new NotFoundException('Conversation not found');
    }

    const message = await this.prismaService.message.create({
      data: {
        conversationId,
        fileName: payload.fileName,
        fileUrl: payload.fileUrl,
        content: payload.content,
        type: payload.type,
        senderType: payload.senderType,
        sentByAdmin: payload.sentByAdmin,
      },
    });

    return message;
  }
}
