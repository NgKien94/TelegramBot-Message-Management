import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@message-management/db';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CatchEverythingFilter } from '../core/filter/exception.filter';
import { AuthGuard } from '../core/auth/guard';
import { ParseTokenMiddleware } from '../core/middlewares/parse-token.middleware';
import { AuthModule } from '../modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MyTransformInterceptor } from '../core/interceptors/transform.interceptor';
import { TelegramModule } from '../modules/telegram-bot/telegram.module';
import { ConversationModule } from '../modules/conversation/conversation.module';
import { SocketModule } from '../modules/socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from '../modules/queue/queue.module';
import { NewQueueModule } from '../modules/new-queue/new-queue.module';
import { WelcomeMessageModule } from '../modules/welcome-message/welcome-message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // BullModule.forRoot({
    //   connection: {
    //     host: process.env.REDIS_HOST,
    //     port: parseInt(process.env.REDIS_PORT)
    //   }
    // }),
    QueueModule,
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    JwtModule,
    TelegramModule,
    ConversationModule,
    SocketModule,
    NewQueueModule,
    WelcomeMessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE, // only for HTTP context
      useFactory: () =>
        new ValidationPipe({
          whitelist: true, // remove fields not in dto
          transform: true, // transform string -> number
          transformOptions: {
            enableImplicitConversion: true, // transform string 'true' -> true
          },
        }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MyTransformInterceptor,
    },

    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParseTokenMiddleware).forRoutes('*');
  }
}
