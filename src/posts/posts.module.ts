import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [UsersModule],
})
export class PostsModule {}
