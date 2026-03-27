import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { UserService } from '../user/user.service';
import { ChatService } from '../chat/chat.service';
import { message } from 'telegraf/filters';
import { OnEvent } from '@nestjs/event-emitter';
import { toHTML } from '@telegraf/entity';
import { WelcomeMessageService } from '../welcome-message/welcome-message.service';
import { downloadToBase64 } from '@message-management/utils';
import { MessageService } from '../message/message.service';
import { MediaGroup } from 'telegraf/typings/telegram-types';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly welcomeMessageService: WelcomeMessageService,
    private readonly messageService: MessageService,
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
    this.botOnReceiveTextMessage();
    this.botOnReceiveImageMessage();
  }

  private botOnStart() {
    this.bot.start(async (ctx) => {
      const { value: welcomeMessageValue } = await this.welcomeMessageService.getWelcomeMessage();

      ctx.reply(welcomeMessageValue);

      const { id, username, first_name, last_name } = ctx.from;

      const telegramUserAvatar = await this.getAvatarTelegramUser(ctx.from.id);

      const telegramUser = await this.userService.createUser({
        username,
        telegramId: String(id),
        firstname: first_name,
        lastname: last_name,
        avatarUrl: telegramUserAvatar,
      });

      await this.chatService.handleStartConversation(telegramUser.id, welcomeMessageValue);
    });
  }

  private botOnReceiveTextMessage() {
    this.bot.on(message('text'), async (ctx) => {
      const { id, username, first_name, last_name } = ctx.from;
      const content = toHTML(ctx.message);

      // update user (username, first_name, last_name)
      const updatedUser = await this.userService.updateUserByTelegramId(String(id), {
        username,
        firstname: first_name,
        lastname: last_name,
      });

      await this.chatService.handleTelegramUserSendTextMessage(updatedUser.id, content);
    });
  }

  private botOnReceiveImageMessage() {
    this.bot.on(message('photo'), async (ctx) => {
      const photos = ctx.message.photo;
      const fileId = photos[0].file_id;

      // Gọi Telegram API để lấy file path
      const fileLink = await ctx.telegram.getFileLink(fileId);
      const resultUrl = await downloadToBase64(fileLink.href);

      const { id, username, first_name, last_name } = ctx.from;

      const updatedUser = await this.userService.updateUserByTelegramId(String(id), {
        username,
        firstname: first_name,
        lastname: last_name,
      });

      await this.chatService.handleTelegramUserSendImage(updatedUser.id, resultUrl);
    });
  }

  private async getAvatarTelegramUser(telegramId: number): Promise<string | undefined> {
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500));

      const photos = (await Promise.race([this.bot.telegram.getUserProfilePhotos(telegramId), timeout])) as any;
      if (!photos.total_count) {
        return undefined;
      }

      const fileId = photos.photos[0].at(0).file_id;
      const file = (await Promise.race([this.bot.telegram.getFile(fileId), timeout])) as any;

      const originAvatarUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      const avatarUrl = await downloadToBase64(originAvatarUrl);
      return avatarUrl;
    } catch (error) {
      console.log('Error from Telegram API: ', error);
      return undefined;
    }
  }

  @OnEvent('message.outgoing.created')
  async sendMessageToTelegramUser(payload: { messageId: string; telegramId: string }) {
    const messageDetail = await this.messageService.getMessageDetail(payload.messageId);
    try {
      if (messageDetail.fileUrls.length > 0) {
        const lastIndex = messageDetail.fileUrls.length - 1;

        const mediaGroup: MediaGroup = messageDetail.fileUrls.map((fileItem, index) => {
          const base64Data = fileItem.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          return {
            type: 'photo',
            media: { source: buffer },
            ...(index === lastIndex && messageDetail.content
              ? { caption: messageDetail.content, parse_mode: 'HTML' }
              : {}),
          };
        });

        // for (const fileItem of messageDetail.fileUrls) {
        //   const base64Data = fileItem.replace(/^data:image\/\w+;base64,/, '');
        //   const buffer = Buffer.from(base64Data, 'base64');
        //   await this.bot.telegram.sendPhoto(payload.telegramId, { source: buffer });
        // }
        await this.bot.telegram.sendMediaGroup(payload.telegramId, mediaGroup);
      } else {
        await this.bot.telegram.sendMessage(payload.telegramId, messageDetail.content, {
          parse_mode: 'HTML',
        });
      }

      // if (messageDetail.content) {
      //   await this.bot.telegram.sendMessage(payload.telegramId, messageDetail.content, {
      //     parse_mode: 'HTML',
      //   });
      // }
    } catch (error) {
      console.log('Error: ', error);
      //fallback plain Text if send markdown message failed
      await this.bot.telegram.sendMessage(payload.telegramId, messageDetail.content);
    }

    await this.chatService.handleSendMessageToTelegramUser(payload.messageId);
  }

  async onModuleDestroy() {
    this.bot.stop();
  }
}
