import { Controller, Get, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  getConversationsList() {
    return this.conversationService.getConversationsList()
  }

  @Get(':id')
  getChatHistoryFromConversation(@Param('id') id: string){
    return this.conversationService.getChatHistoryOfConversation(id)
  }
}
