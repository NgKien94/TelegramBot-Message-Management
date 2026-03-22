import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    let error = {
      message: 'Websocket error',
    };

    if (exception instanceof WsException) {
      error = exception.getError() as any;
    }

    client.emit('error', error);
  }
}
