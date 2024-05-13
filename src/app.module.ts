import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './plans/plans.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ImagesModule } from './images/images.module';
import { GrowthRepotsModule } from './growth-repots/growth-repots.module';
import { LifeModule } from './life/life.module';

@Module({
  imports: [UsersModule, AuthModule, PlansModule, TransactionsModule, PostsModule, CommentsModule, ImagesModule, GrowthRepotsModule, LifeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
