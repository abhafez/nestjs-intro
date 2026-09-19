import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetaOptionService } from './meta-option.service';
import { CreateMetaOptionDto } from './dto/create-meta-option.dto';
import { UpdateMetaOptionDto } from './dto/update-meta-option.dto';

@Controller('meta-option')
export class MetaOptionController {
  constructor(private readonly metaOptionService: MetaOptionService) {}

  @Post()
  create(@Body() createMetaOptionDto: CreateMetaOptionDto) {
    return this.metaOptionService.create(createMetaOptionDto);
  }

  @Get()
  findAll() {
    return this.metaOptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metaOptionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetaOptionDto: UpdateMetaOptionDto) {
    return this.metaOptionService.update(+id, updateMetaOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metaOptionService.remove(+id);
  }
}
