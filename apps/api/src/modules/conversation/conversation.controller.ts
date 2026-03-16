import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { UpdateConversationDto } from './conversation.dto';
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  getConversationsList() {
    return this.conversationService.getConversationsList();
  }

  @Get(':id')
  getChatHistoryFromConversation(@Param('id') id: string) {
    return this.conversationService.getChatHistoryOfConversation(id);
  }

  @Patch(':id')
  updateConversation(@Param('id') id: string,@Body() payload: UpdateConversationDto) {
    return this.conversationService.updateConversation(id, payload);
  }
}
