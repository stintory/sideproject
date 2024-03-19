import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
// import { UsageRepository } from '../../usage/repository/usage.repository';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class CountingInterceptor implements NestInterceptor {
  // constructor(private readonly usageRepository: UsageRepository) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(async (data) => {
        res.locals.countingResult = {
          success: true,
          data: data,
        };

        const appKey: string = req.headers['app-key'];
        const endpoint: any = req.url;
        const splitEndpoint: string = endpoint.split('/');
        const controller: string = splitEndpoint[2];

        const logData = {
          appKey: appKey,
          createdAt: new Date(),
          endpoint: endpoint,
          method: req.method,
          controller: controller,
        };

        console.log(req);

        // await this.usageRepository.createLogs(logData);
      }),
      catchError(async (error) => {
        throw new BadRequestException(error.message);
      }),
    );
  }
}
