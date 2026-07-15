import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

export interface ResponseWithMessage<T> {
  data: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((payload: T | ResponseWithMessage<T>) => {
        if (
          payload !== null &&
          typeof payload === 'object' &&
          'data' in payload
        ) {
          const wrapped = payload;
          return {
            success: true,
            data: wrapped.data,
            message: wrapped.message,
          };
        }

        return {
          success: true,
          data: payload,
        };
      }),
    );
  }
}
