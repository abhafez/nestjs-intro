import { Module } from '@nestjs/common';
import { MetaOptionService } from './meta-option.service';
import { MetaOptionController } from './meta-option.controller';

@Module({
  controllers: [MetaOptionController],
  providers: [MetaOptionService],
})
export class MetaOptionModule {}
