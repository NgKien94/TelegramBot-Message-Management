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
import { Message } from 'telegraf/typings/core/types/typegram';
import { join } from 'path';
import { createReadStream } from 'fs';
import axios from 'axios';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;
  private mapReceivedImages: Map<
    string,
    {
      userId: string;
      caption?: string;
      fileUrls: string[];
      timer: NodeJS.Timeout;
    }
  >;
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly welcomeMessageService: WelcomeMessageService,
    private readonly messageService: MessageService,
    private readonly uploadService: UploadService
  ) {}

  async onModuleInit() {
    const token = this.configService.get<string>('BOT_TOKEN');
    this.mapReceivedImages = new Map<
      string,
      {
        userId: string;
        caption?: string;
        fileUrls: string[];
        timer: NodeJS.Timeout;
      }
    >();

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
      const caption = toHTML(ctx.message as Message.PhotoMessage);
      const mediaGroupId = (ctx.message as Message.PhotoMessage).media_group_id;

      console.log("Photos: ",photos);
      const fileId = photos[0].file_id;
      console.log('Caption: ', caption);

      // Call telegram API to get file path
      const fileLink = await ctx.telegram.getFileLink(fileId);
      // base64
      // const resultUrl = await downloadToBase64(fileLink.href);

      // download file and use internal upload api
      const response = await axios.get(fileLink.href , { responseType: 'stream' });
      const resultUrl = await this.uploadService.saveFileFromStream(response.data, 'file.jpg');


      const { id, username, first_name, last_name } = ctx.from;

      const updatedUser = await this.userService.updateUserByTelegramId(String(id), {
        username,
        firstname: first_name,
        lastname: last_name,
      });

      if (!mediaGroupId) {
        await this.chatService.handleTelegramUserSendImages(updatedUser.id, [resultUrl], caption);
      } else {
        console.log('Caption: ', caption);
        this.sendMediaGroup(mediaGroupId, updatedUser.id, caption, resultUrl);
      }
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
      // base64
      // const avatarUrl = await downloadToBase64(originAvatarUrl);
      // return avatarUrl;

      // download avatar and use internal upload api
      const response = await axios.get(originAvatarUrl, { responseType: 'stream' });
      // const buffer = Buffer.from(response.data);
      const url = await this.uploadService.saveFileFromStream(response.data, 'avatar.jpg');
      return url
    } catch (error) {
      console.log('Error from Telegram API: ', error);
      return undefined;
    }
  }

  private sendMediaGroup(mediaGroupId: string, userId: string, caption: string, fileUrl: string) {
    const hasMediaGroupId = this.mapReceivedImages.has(mediaGroupId);

    if (hasMediaGroupId) {
      clearTimeout(this.mapReceivedImages.get(mediaGroupId).timer);
    } else {
      this.mapReceivedImages.set(mediaGroupId, {
        userId,
        fileUrls: [],
        caption: undefined,
        timer: null,
      });
    }

    const group = this.mapReceivedImages.get(mediaGroupId);
    group.fileUrls.push(fileUrl);
    if (caption) {
      group.caption = caption;
    }

    group.timer = setTimeout(async () => {
      this.mapReceivedImages.delete(mediaGroupId);

      await this.chatService.handleTelegramUserSendImages(userId, [...group.fileUrls], group.caption);
    }, 500);
  }

  @OnEvent('message.outgoing.created')
  async sendMessageToTelegramUser(payload: { messageId: string; telegramId: string }) {
    const messageDetail = await this.messageService.getMessageDetail(payload.messageId);
    try {
      if (messageDetail.fileUrls.length > 0) {
        const lastIndex = messageDetail.fileUrls.length - 1;

        // const mediaGroup: MediaGroup = messageDetail.fileUrls.map((fileItem, index) => {
        //   const base64Data = fileItem.replace(/^data:image\/\w+;base64,/, '');
        //   const buffer = Buffer.from(base64Data, 'base64');
        //   return {
        //     type: 'photo',
        //     media: { source: buffer },
        //     ...(index === lastIndex && messageDetail.content
        //       ? { caption: messageDetail.content, parse_mode: 'HTML' }
        //       : {}),
        //   };
        // });

        const mediaGroup: MediaGroup = messageDetail.fileUrls.map((fileItem, index) => {
          const fileName = fileItem.split('/').pop();
          const filePath = join(process.cwd(), 'apps', 'api', 'files', fileName);

          return {
            type: 'photo',
            media: { source: createReadStream(filePath) },
            ...(index === lastIndex && messageDetail.content
              ? { caption: messageDetail.content, parse_mode: 'HTML' }
              : {}),
          };
        });
        await this.bot.telegram.sendMediaGroup(payload.telegramId, mediaGroup);
      } else {
        await this.bot.telegram.sendMessage(payload.telegramId, messageDetail.content, {
          parse_mode: 'HTML',
        });
      }
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
