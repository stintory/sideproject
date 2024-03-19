import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

interface ResponseObject {
  statusCode: number;
  message: string;
  error: string;
}

@Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   private readonly logger: Logger = new Logger();
//   catch(exception, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;
//
//     if (exception instanceof HttpException) {
//       const error = exception.getResponse() as ResponseObject;
//       console.log(error);
//
//       response.status(status).json({
//         message: error.message,
//         statusCode: error.statusCode,
//       });
//     } else {
//       console.error(exception); // 에러 메세지 출력을 exception으로 받아야 함.
//       response.status(500).json({
//         message: 'Internal Server Error',
//         statusCode: 500,
//       });
//     }
//   }
// }
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger();

  public catch(exception, host: ArgumentsHost) {
    let args: unknown;
    let message = 'UNKNOWN ERROR';

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const statusCode = this.getHttpStatus(exception);

    const datetime = new Date();

    message = exception instanceof HttpException ? exception.message : message;

    const errorResponse = {
      code: statusCode,
      timestamp: datetime,
      path: req.url,
      method: req.method,
      message: message,
    };
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ err: errorResponse, args: { req, res } });
    } else {
      this.logger.warn({ err: errorResponse, args });
    }
    res.status(statusCode).json(errorResponse);
  }

  private getHttpStatus(exception: unknown): HttpStatus {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
