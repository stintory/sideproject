import { utilities, WinstonModule } from 'nest-winston';
import winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import * as path from 'app-root-path';
import { makeFolder } from '../../@utils/util';

const env = process.env.NODE_ENV;
const rootPath = path.toString();
const LOGS_FOLDER = `${rootPath}/_logs`;
const dailyOptions = (level: string) => ({
  level,
  datePattern: 'YYYY-MM-DD',
  dirname: `${LOGS_FOLDER}/${level}`,
  filename: `%DATE%.${level}.log`,
  maxFiles: 30, //30일치 로그파일 저장
  zippedArchive: true, // 로그가 쌓이면 압축하여 관리
});
export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: env === 'production' ? 'http' : 'silly',
      format:
        env === 'production'
          ? winston.format.simple()
          : winston.format.combine(
              winston.format.timestamp(),
              winston.format.colorize({
                all: true,
                colors: {
                  error: 'red',
                  warn: 'yellow',
                  info: 'green',
                  verbose: 'cyan',
                  debug: 'blue',
                },
              }),
              utilities.format.nestLike('platform-api-nestjs', {
                colors: true,
                prettyPrint: true, // nest에서 제공하는 옵션. 로그 가독성을 높여줌
              }),
            ),
    }),
    // info, warn, error 로그는 파일로 관리
    ...['info', 'warn', 'error', 'verbose', 'debug'].map((level) => new winstonDaily(dailyOptions(level))),
  ],
});

function createLogsFolder() {
  makeFolder(LOGS_FOLDER);
}

export async function onModuleInit() {
  await createLogsFolder();
}
