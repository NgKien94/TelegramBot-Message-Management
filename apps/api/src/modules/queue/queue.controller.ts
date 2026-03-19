import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Post } from '@nestjs/common';
import { Queue } from 'bullmq';
import { UserService } from '../user/user.service';
import { CreateMessageOfQueueDto } from './queue.dto';
import { MessageType, SenderType } from '@message-management/types';
import { SendMessageJobType } from './queue.type';

@Controller('broadcast')
export class QueueController {
  constructor(
    @InjectQueue('broadcast') private readonly queue: Queue<SendMessageJobType>,
    private readonly usersService: UserService,
  ) {}

  @Post('messages')
  async sendMessagesJob(@Body() body: CreateMessageOfQueueDto) {
    const users = await this.usersService.getUsers();
    await this.queue.addBulk(
      users.map((user) => {
        return {
          name: 'send-messages-job',
          data: {
            conversationId: user.conversation.id,
            payload: {
              ...body,
              type: MessageType.TEXT,
              senderType: SenderType.OUTGOING,
              sentByAdmin: true,
            },
          },
        };
      }),
    );
  }
}
