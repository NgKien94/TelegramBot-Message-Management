import { Body, Controller, Post } from '@nestjs/common';
import { NewQueueService } from './new-queue.service';
import { JobTypeOfNewQueue } from './new-queue.type';
import { CreateMessageOfNewQueueDto } from './new-queue.dto';
import { SenderType } from '@message-management/types';

@Controller('new-broadcast')
export class NewQueueController {
  constructor(private readonly queueService: NewQueueService<JobTypeOfNewQueue>) {}

  @Post('messages')
  sendBroadcastMessage(@Body() body: CreateMessageOfNewQueueDto) {
    const {conversationIds, ...rest} = body

    this.queueService.addBulk( (conversationIds).map(item => {
      return {
        jobName: 'send-broadcast-message',
        conversationId: item,
        payload: {
          ...rest,
          senderType: SenderType.OUTGOING,
          sentByAdmin: true
        }
      }
    }))
  }

}

