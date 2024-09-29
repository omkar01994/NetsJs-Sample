import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        // Extract the message and data from the result
        const message = result.message || 'Request successful';
        if (result.message) {
          delete result.message;
        }
        const data = result.data || result;

        return {
          statusCode,
          message, // Dynamic message from service
          data, // Data from the service
        };
      }),
    );
  }
}
