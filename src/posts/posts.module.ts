import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';
import { Post } from './post.entity';
import { MetaOption } from '../meta-option/entities/meta-option.entity';
import { TagsService } from '../tags/tags.service';
import { TagsModule } from '../tags/tags.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [UsersModule, TypeOrmModule.forFeature([Post, MetaOption]), TagsModule],
})
export class PostsModule {}
