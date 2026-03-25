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

    while (this.queueService.getNumberOfJobs() > 0) {
      let numberOfJobs = this.queueService.getNumberOfJobs();
      const listJob = [];

      for (let index = 1; index <= Math.min(concurrency, numberOfJobs); index++) {
        const job = this.queueService.getJobFromQueue();
        if (job !== undefined) {
          listJob.push(this.handleJob(job));
        }
      }

      await Promise.all(listJob);
      numberOfJobs -= concurrency;
    }

    this.queueService.setIsProcessing(false);
    return;
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
}
