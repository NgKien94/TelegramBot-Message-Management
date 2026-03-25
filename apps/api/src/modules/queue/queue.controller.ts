import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Post } from '@nestjs/common';
import { Queue } from 'bullmq';
import { UserService } from '../user/user.service';
import { CreateMessageOfQueueDto } from './queue.dto';
import {  SenderType } from '@message-management/types';
import { SendMessageJobType } from './queue.type';

@Controller('broadcast')
export class QueueController {
  constructor(
    // @InjectQueue('broadcast') private readonly queue: Queue<SendMessageJobType>,
    private readonly usersService: UserService,
  ) {}

  // @Post('messages')
  // async sendMessagesJob(@Body() body: CreateMessageOfQueueDto) {
  //   const {conversationIds, ...rest} = body

  //   await this.queue.addBulk(
  //     conversationIds.map( conversationId => {
  //       return {
  //         name: 'send-messages-job',
  //         data: {
  //           conversationId,
  //           payload: {
  //             ...rest,
  //             senderType: SenderType.OUTGOING,
  //             sentByAdmin: true
  //           }
  //         }
  //       }
  //     })
  //   )
  // }
}
