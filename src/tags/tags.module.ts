import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagsService } from './providers/tags.service';
import { PaginationModule } from '../common/pagination/pagination.module';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [PaginationModule, TypeOrmModule.forFeature([Tag])],
  exports: [TagsService],
})
export class TagsModule {}
