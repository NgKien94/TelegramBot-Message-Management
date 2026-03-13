import { PrismaService } from '@message-management/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService, private readonly eventMitter: EventEmitter2) {}

  async addMessageIntoConversation(conversationId: string, payload: CreateMessageDto) {
    const isExistConversation = await this.prismaService.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        telegramUser: true,
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

    if (message.senderType === 'OUTGOING') {
      // emit event messageId, telegramId for telegram service to send message to Telegram user
      this.eventMitter.emit('message.outgoing.created', {
        messageId: message.id,
        content: message.content,
        telegramId: isExistConversation.telegramUser.telegramID
      })

    }

    return message;
  }

  async getMessageDetail (messageId: string) {
    const message = await this.prismaService.message.findUnique({
      where: {
        id: messageId
      }
    })

    return message
  }
}
