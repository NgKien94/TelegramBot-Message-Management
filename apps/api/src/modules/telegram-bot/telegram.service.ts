import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { UserService } from '../user/user.service';
import { ChatService } from '../chat/chat.service';
import { message } from 'telegraf/filters';
import { OnEvent } from '@nestjs/event-emitter';

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
    this.botListenMessage();
  }

  private async botOnStart() {
    // replace later
    const WELCOME_MESSAGE = 'Welcome';

    this.bot.start(async (ctx) => {
      ctx.reply(WELCOME_MESSAGE);

      const { id, username, first_name, last_name } = ctx.from;

      const telegramUserAvatar = await this.getAvatarTelegramUser(ctx.from.id);
      // // console.log(telegramUserAvatar);

      const telegramUser = await this.userService.createUser({
        username,
        telegramId: String(id),
        firstname: first_name,
        lastname: last_name,
        avatarUrl: telegramUserAvatar,
      });

      await this.chatService.handleStartConversation(telegramUser.id, WELCOME_MESSAGE);
    });
  }

  private async botListenMessage() {
    this.bot.on(message('text'), async (ctx) => {
      console.log('Text ');
      const { id, username, first_name, last_name } = ctx.from;
      // get message (ctx.message.text)
      const content = ctx.message.text;

      // update user (username, first_name, last_name)
      const updatedUser = await this.userService.updateUserByTelegramId(String(id), {
        username,
        firstname: first_name,
        lastname: last_name,
      });

      await this.chatService.handleTelegramUserSendMessage(updatedUser.id, content);
    });
  }

  private async getAvatarTelegramUser(telegramId: number): Promise<string | undefined> {
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000));

      const photos = (await Promise.race([this.bot.telegram.getUserProfilePhotos(telegramId), timeout])) as any;
      if (!photos.total_count) {
        return undefined;
      }

      const fileId = photos.photos[0].at(-1).file_id;
      const file = (await Promise.race([this.bot.telegram.getFile(fileId), timeout])) as any;

      const avatarUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      return avatarUrl;
    } catch (error) {
      console.log('Error from Telegram API: ', error);
      return undefined;
    }
  }

  @OnEvent('message.outgoing.created')
  async sendMessageToTelegramUser(payload: { messageId: string; content: string; telegramId: string }) {
    await this.bot.telegram.sendMessage(payload.telegramId, payload.content);

    await this.chatService.handleSendMessageToTelegramUser(payload.messageId);
  }

  async onModuleDestroy() {
    this.bot.stop();
  }
}
