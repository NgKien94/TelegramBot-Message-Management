import { PrismaService } from '@message-management/db';
import {  Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async createUser(payload: CreateUserDto) {
    const { telegramId } = payload;
    const isExistTelegramUser =
      await this.prismaService.telegramUser.findUnique({
        where: {
          telegramID: telegramId
        },
      });

    if(isExistTelegramUser) {
      // Telegram user is exist
      return isExistTelegramUser
    }

    const user = await this.prismaService.telegramUser.create({
      data: {
        telegramID: payload.telegramId,
        username: payload.username,
        firstName: payload.firstname,
        lastName: payload.lastname,
        avatarUrl: payload.avatarUrl
      }
    })

    return user
  }
}
