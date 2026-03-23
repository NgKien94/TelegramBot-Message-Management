import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MessageService } from '../message/message.service';
import { SendMessageJobType } from './queue.type';

@Processor('broadcast')
export class QueueProcessor extends WorkerHost {
  constructor(private readonly messageService: MessageService) {
    super();
  }

  async process(job: Job<SendMessageJobType>): Promise<any> {
    switch (job.name) {
      case 'send-messages-job': {
        const { conversationId, payload } = job.data;

        await this.messageService.addMessageIntoConversation(conversationId, {
          conversationId,
          ...payload,
        });

        return {};
      }
      default: {
        console.log('Default handler in processor');
        return {};
      }
    }
  }
}
