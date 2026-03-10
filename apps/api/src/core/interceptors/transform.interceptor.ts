import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseFromServer } from "@message-management/types";
import { isApiResponseFromServer } from '@message-management/utils';


@Injectable()
export class MyTransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponseFromServer<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponseFromServer<T>> {
    return next.handle().pipe(
      map((dataRaw): ApiResponseFromServer<T> => {
        if (isApiResponseFromServer<T>(dataRaw)) {
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
