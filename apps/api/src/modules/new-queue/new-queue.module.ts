import { Module } from '@nestjs/common';
import { NewQueueController } from './new-queue.controller';
import { NewQueueService } from './new-queue.service';
import { NewQueueProcessor } from './new-queue.processor';
import { MessageModule } from '../message/message.module';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [MessageModule],
  controllers: [NewQueueController],
  providers: [{
    provide: NewQueueService,
    useFactory: (eventMitter: EventEmitter2) => {
      return new NewQueueService(eventMitter,2,3)
    },
    inject: [EventEmitter2]
  }, NewQueueProcessor],
})
export class NewQueueModule {}
