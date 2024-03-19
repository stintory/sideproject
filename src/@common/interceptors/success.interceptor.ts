import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        const countingResult = response.locals.countingResult;
        if (countingResult) {
          return {
            data: countingResult.data,
            statusCode: statusCode,
          };
        }

        return {
          ...data,
          statusCode: statusCode,
        };
      }),
    );
  }
}
