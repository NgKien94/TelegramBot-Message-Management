import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { GetConversationDto, UpdateConversationDto } from './conversation.dto';
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  getConversationsList(@Query() filter: GetConversationDto) {
    return this.conversationService.getConversationsList(filter);
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
