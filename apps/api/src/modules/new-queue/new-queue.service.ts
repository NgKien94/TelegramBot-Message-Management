import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NewQueueService<T> {
  private data: T[]
  private concurrency: number
  private isProcessing: boolean
  private retry: number;
  private timeout: number

  constructor(private readonly eventMitter: EventEmitter2, concurrency = 1, retry = 1, timeout = 10000){
    this.data = []
    this.concurrency = concurrency
    this.isProcessing = false
    this.retry = retry
    this.timeout = timeout
  }

  addJob(job: T) {
    this.data.push(job)
    this.eventMitter.emit('job_added')
  }

  addBulk(listJob: T[]) {
    this.data.push(...listJob)
    this.eventMitter.emit('job_added')
  }

  getNumberOfJobs(): number{
    return this.data.length
  }

  getConcurrency(): number {
    return this.concurrency
  }

  getRetry(): number {
    return this.retry
  }

  setIsProcessing(value: boolean) {
    this.isProcessing = value
  }

  getIsProcessing(): boolean {
    return this.isProcessing
  }

  getTimeout(): number {
    return this.timeout
  }

  getJobFromQueue(): T {
    return this.data.shift()
  }
}
