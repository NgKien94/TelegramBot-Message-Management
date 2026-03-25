import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueProcessor } from './queue.processor';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    // BullModule.registerQueue({
    //   name: 'broadcast',
    // }),
    UserModule,
    MessageModule,
  ],
  controllers: [QueueController],
  providers: [QueueProcessor],
})
export class QueueModule {}
