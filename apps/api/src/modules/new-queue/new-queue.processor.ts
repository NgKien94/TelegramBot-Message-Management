import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NewQueueService } from './new-queue.service';
import { MessageService } from '../message/message.service';
import { JobTypeOfNewQueue } from './new-queue.type';

@Injectable()
export class NewQueueProcessor {
  constructor(
    private readonly queueService: NewQueueService<JobTypeOfNewQueue>,
    private readonly messageService: MessageService,
  ) {}

  @OnEvent('job_added')
  async process() {
    if (this.queueService.getIsProcessing() === true) {
      return;
    }

    const concurrency = this.queueService.getConcurrency();
    this.queueService.setIsProcessing(true);

    const promises = Array.from({ length: concurrency }, () => this.runWorker());
    await Promise.all(promises);

    this.queueService.setIsProcessing(false);
    return;
  }

  async runWorker() {
    while (true) {
      const job = this.queueService.getJobFromQueue();

      console.log('Job: ', job);
      if (job === undefined) {
        return;
      }
      try {
        await this.handleJob(job); 
      } catch (error) {
        console.log("Error when process job: ",error);
        console.log("Start retry job ");
        await this.retryJob(job);
      }
    }
  }

  async handleJob(job: JobTypeOfNewQueue) {
    console.log('Job raw: ', job);
    if (job.jobName === 'send-broadcast-message') {
      const { conversationId, payload } = job;

      await this.messageService.addMessageIntoConversation(conversationId, {
        conversationId,
        ...payload,
      });
    }
  }

  async retryJob(job: JobTypeOfNewQueue) {
    let retryCounter = this.queueService.getRetryCounterConfig();
    let isFailed = true;

    while (retryCounter > 0 && isFailed === true) {
      try {
        retryCounter--;
        await this.handleJob(job);
        isFailed = false;
      } catch (error) {
        console.log('Error when retry: ', error);
      }
    }

    if (isFailed === true) {
      console.log('Job failed after all retry turn');
    }

    console.log('Job success after retry');
  }
}
