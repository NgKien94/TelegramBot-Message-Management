import { PrismaService } from '@message-management/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async createUser(payload: CreateUserDto) {
    const { telegramId } = payload;
    const isExistTelegramUser = await this.prismaService.telegramUser.findUnique({
      where: {
        telegramID: telegramId,
      },
    });

    if (isExistTelegramUser) {
      // Telegram user is exist
      return isExistTelegramUser;
    }

    const user = await this.prismaService.telegramUser.create({
      data: {
        telegramID: payload.telegramId,
        username: payload.username,
        firstName: payload.firstname,
        lastName: payload.lastname,
        avatarUrl:
          payload.avatarUrl ||
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_nLCu85ayoTKwYw6alnvrockq5QBT2ZWR2g&s',
      },
    });

    return user;
  }

  async updateUserByTelegramId(telegramId: string, payload: UpdateUserDto) {
    const isExistTelegramUser = await this.prismaService.telegramUser.findUnique({
      where: {
        telegramID: telegramId,
      },
    });

    if (!isExistTelegramUser) {
      throw new NotFoundException('Telegram user not found');
    }

    const user = await this.prismaService.telegramUser.update({
      where: {
        telegramID: telegramId,
      },
      data: {
        username: payload.username,
        firstName: payload.firstname,
        lastName: payload.lastname,
      },
    });

    return user;
  }
}
