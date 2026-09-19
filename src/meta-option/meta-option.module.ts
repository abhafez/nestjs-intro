import { Module } from '@nestjs/common';
import { MetaOptionService } from './meta-option.service';
import { MetaOptionController } from './meta-option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOption } from './entities/meta-option.entity';

@Module({
  controllers: [MetaOptionController],
  providers: [MetaOptionService],
  imports: [TypeOrmModule.forFeature([MetaOption])],
})
export class MetaOptionModule {}
