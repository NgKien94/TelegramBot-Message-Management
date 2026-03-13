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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    JwtModule,
    TelegramModule,
    ConversationModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
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
