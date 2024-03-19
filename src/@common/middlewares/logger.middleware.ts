import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   private logger = new Logger('HTTP');
//   use(req: Request, res: Response, next: NextFunction) {
//     res.on('finish', () => {
//       this.logger.log(
//         `${req.ip} ${req.method} ${res.statusCode}`,
//         req.originalUrl,
//       );
//     });
//     next();
//   }
// }

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent');
    const datetime = new Date();
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(`${datetime} ${method} ${originalUrl} ${statusCode} ${ip} ${userAgent}`);
    });

    res.on('error', (error) => {
      this.logger.error(`Error: ${error}`);
    });

    next();
  }
}
