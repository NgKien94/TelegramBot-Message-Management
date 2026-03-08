import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApiResponse, HttpMessage } from '@message-management/types';
import { isValidationErrorResponse } from '@message-management/utils'

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const responseBody: ApiResponse<never> = {
      success: false,
      error: {
        message: HttpMessage.INTERNAL_SERVER_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    };

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (
        isValidationErrorResponse(res) &&
        exception instanceof BadRequestException
      ) {
        responseBody.error.message = res.message[0];
        responseBody.error.statusCode = HttpStatus.BAD_REQUEST;
      } else if (exception instanceof NotFoundException) {
        responseBody.error.message = exception.message;
        responseBody.error.statusCode = HttpStatus.NOT_FOUND;
      } else {
        responseBody.error.statusCode = exception.getStatus();
        responseBody.error.message = exception.message;
      }
    }

    if (!(exception instanceof HttpException)) {
      console.log('Server exception: ', exception);
    }

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      responseBody.error.statusCode,
    );
  }
}
