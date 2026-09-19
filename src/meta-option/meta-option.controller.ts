import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetaOptionService } from './meta-option.service';
import { CreateMetaOptionDto } from './dto/create-meta-option.dto';
import { UpdateMetaOptionDto } from './dto/update-meta-option.dto';

/** Meta option CRUD routes. */
@Controller('meta-option')
export class MetaOptionController {
  constructor(private readonly metaOptionService: MetaOptionService) {}

  //#region POST /meta-option
  /**
   * Creates a meta option.
   * @param createMetaOptionDto meta option data
   */
  @Post()
  create(@Body() createMetaOptionDto: CreateMetaOptionDto) {
    return this.metaOptionService.create(createMetaOptionDto);
  }
  //#endregion

  //#region GET /meta-option
  /** Lists all meta options. */
  @Get()
  findAll() {
    return this.metaOptionService.findAll();
  }
  //#endregion

  //#region GET /meta-option/:id
  /**
   * Gets a meta option by id.
   * @param id meta option id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metaOptionService.findOne(+id);
  }
  //#endregion

  //#region PATCH /meta-option/:id
  /**
   * Updates a meta option.
   * @param id meta option id
   * @param updateMetaOptionDto fields to update
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetaOptionDto: UpdateMetaOptionDto) {
    return this.metaOptionService.update(+id, updateMetaOptionDto);
  }
  //#endregion

  //#region DELETE /meta-option/:id
  /**
   * Deletes a meta option.
   * @param id meta option id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metaOptionService.remove(+id);
  }
  //#endregion
}
