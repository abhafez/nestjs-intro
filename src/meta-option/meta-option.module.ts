import { Module } from '@nestjs/common';
import { MetaOptionService } from './providers/meta-option.service';
import { MetaOptionController } from './meta-option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOption } from './entities/meta-option.entity';
import { PaginationModule } from '../common/pagination/pagination.module';

@Module({
  controllers: [MetaOptionController],
  providers: [MetaOptionService],
  imports: [PaginationModule, TypeOrmModule.forFeature([MetaOption])],
})
export class MetaOptionModule {}
