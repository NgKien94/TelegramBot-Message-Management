import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from "@message-management/types";
import { isApiResponse } from '@message-management/utils';


@Injectable()
export class MyTransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((dataRaw): ApiResponse<T> => {
        if (isApiResponse<T>(dataRaw)) {
          return dataRaw;
        }

        return {
          success: true,
          data: dataRaw,
        };
      }),
    );
  }
}
