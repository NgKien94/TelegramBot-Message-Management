import { PrismaService } from '@message-management/db';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class WelcomeMessageService {
  constructor( private readonly prismaService: PrismaService) {}

  async updateWelcomeMessage(newValue: string) {

    const updatedValue = await this.prismaService.welcomeMessage.upsert({
      where: {
        singleton: 'default'
      },
      update: {
        value: newValue
      },
      create: {
        value: newValue
      }
    })

    return updatedValue
  }

  async getWelcomeMessage() {
    const welcomeMessage = await this.prismaService.welcomeMessage.findUnique({
      where: {
        singleton: 'default'
      }
    })

    if(!welcomeMessage) {
      throw new NotFoundException("Welcome message has not been configured")
    }

    return welcomeMessage
  }
}
