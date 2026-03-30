import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { UserModule } from '../user/user.module';
import { ChatModule } from '../chat/chat.module';
import { WelcomeMessageModule } from '../welcome-message/welcome-message.module';
import { MessageModule } from '../message/message.module';
import { UploadModule } from '../upload/upload.module';
@Module({
  imports: [UserModule, ChatModule, WelcomeMessageModule, MessageModule, UploadModule],
  providers: [TelegramService],
})
export class TelegramModule {}
