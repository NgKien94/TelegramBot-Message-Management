import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NewQueueService<T> {
  private data: T[]
  private concurrency: number
  private isProcessing: boolean
  private retry: number;

  constructor(private readonly eventMitter: EventEmitter2, concurrency = 1, retry = 1){
    this.data = []
    this.concurrency = concurrency
    this.isProcessing = false
    this.retry = retry
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

  getRetryCounterConfig(): number {
    return this.retry
  }

  setIsProcessing(value: boolean) {
    this.isProcessing = value
  }

  getIsProcessing(): boolean {
    return this.isProcessing
  }

  getJobFromQueue(): T {
    return this.data.shift()
  }
}
