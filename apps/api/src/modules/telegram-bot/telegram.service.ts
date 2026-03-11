import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { UserService } from '../user/user.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  async onModuleInit() {
    const token = this.configService.get<string>('BOT_TOKEN');
    this.bot = new Telegraf(token);

    // bot onListener handlers
    this.botOnListenHandler();

    this.bot.launch({
      dropPendingUpdates: true, // don't handle message when bot offline
    });

    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  private botOnListenHandler() {
    this.botOnStart();
  }

  private async botOnStart() {
    // replace later
    const WELCOME_MESSAGE = 'Welcome';

    this.bot.start(async (ctx) => {
      ctx.reply(WELCOME_MESSAGE);
      console.log('Info: ', ctx.from);
      const { id, username, first_name, last_name } = ctx.from;
      /**
       * Info:  {
  id: 5839551718,
  is_bot: false,
  first_name: 'Nguyen',
  last_name: 'Kien',
  username: 'ngkien94',
  language_code: 'vi'
}
       *
       */
      const telegramUserAvatar = await this.getAvatarTelegramUser(ctx.from.id);
      console.log(telegramUserAvatar);

      const user = await this.userService.createUser({
        username,
        telegramId: String(id),
        firstname: first_name,
        lastname: last_name,
        avatarUrl: telegramUserAvatar,
      });

      await this.chatService.handleStartConversation(user.id, WELCOME_MESSAGE);
    });
  }

  private async getAvatarTelegramUser(telegramId: number): Promise<string> {
    const photos = await this.bot.telegram.getUserProfilePhotos(telegramId);
    if (!photos.total_count) {
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_nLCu85ayoTKwYw6alnvrockq5QBT2ZWR2g&s';
    }

    const fileId = photos.photos[0].at(-1).file_id;
    const file = await this.bot.telegram.getFile(fileId);
    const avatarUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
    return avatarUrl;
  }

  async onModuleDestroy() {
    this.bot.stop();
  }
}
