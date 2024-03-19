import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable, from, finalize } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { ClientSession } from 'mongoose';
import { MongoClient } from 'mongodb';
// import { UsageRepository } from '../../usage/repository/usage.repository';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  // constructor(private readonly usageRepository: UsageRepository) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const client = new MongoClient(process.env.MONGO_CONN_URI);

    return from(client.connect()).pipe(
      switchMap(() => {
        const session: ClientSession = client.startSession();
        session.startTransaction();

        return next.handle().pipe(
          tap(async (result) => {
            // 추가된 부분.
            res.locals.transactionResult = {
              success: true,
              data: result,
            };

            const appKey: string = req.headers['app-key'];
            const endpoint: any = req.url;

            const logData = {
              appKey: appKey,
              createdAt: new Date(),
              count: 1,
              endpoint: endpoint,
              method: req.method,
            };

            // await this.usageRepository.createLogs(logData);

            return;
          }),
          catchError(async (error) => {
            await session.abortTransaction();
            throw new BadRequestException(error.message);
          }),
          finalize(async () => {
            await session.endSession();
          }),
        );
      }),
    );
  }
}
