import { Body, Controller, Get, Put } from '@nestjs/common';
import { WelcomeMessageService } from './welcome-message.service';
import { UpdateWelcomeMessageDto } from './welcome-message.dto';

@Controller('welcome-message')
export class WelcomeMessageController {
  constructor(private readonly welcomeMessageService: WelcomeMessageService) {}

  @Put()
  async updateWelcomeMessage(@Body() body: UpdateWelcomeMessageDto) {
    return await this.welcomeMessageService.updateWelcomeMessage(body.message)
  }


  @Get()
  async getData() {
    return await this.welcomeMessageService.getWelcomeMessage();
  }
}
