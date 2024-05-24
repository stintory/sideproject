import { MiddlewareConsumer, Module, NestModule, RequestMethod, UseFilters } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ImagesModule } from './images/images.module';
import { DiaryModule } from './diary/diary.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SuccessInterceptor } from './@common/interceptors/success.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import mongoose from 'mongoose';
import { GlobalExceptionFilter } from './@common/exceptions/global-exception.filter';
import { LoggerMiddleware } from './@common/middlewares/logger.middleware';
import { PetsModule } from './pets/pets.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONN_URI),
    UsersModule,
    AuthModule,
    PlansModule,
    TransactionsModule,
    PostsModule,
    CommentsModule,
    ImagesModule,
    DiaryModule,
    PetsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessInterceptor,
    },
  ],
})
@UseFilters(GlobalExceptionFilter)
export class AppModule implements NestModule {
  private readonly isDev = process.env.MODE === 'dev';

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });

    mongoose.set('debug', this.isDev);
  }
}
