import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './message.dto';
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(@Body() body: CreateMessageDto) {
    await this.messageService.addMessageIntoConversation(body.conversationId,body)
  }
}
