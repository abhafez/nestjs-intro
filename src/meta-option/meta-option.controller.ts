import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetaOptionService } from './providers/meta-option.service';
import { CreateMetaOptionDto } from './dto/create-meta-option.dto';
import { UpdateMetaOptionDto } from './dto/update-meta-option.dto';
import { GetMetaOptionsDto } from './dto/get-meta-options.dto';

/** Meta option CRUD routes. */
@ApiTags('Meta Options')
@Controller('meta-option')
export class MetaOptionController {
  constructor(private readonly metaOptionService: MetaOptionService) {}

  //#region POST /meta-option
  /**
   * Creates a meta option.
   * @param createMetaOptionDto meta option data
   */
  @ApiOperation({ summary: 'Create a meta option' })
  @ApiResponse({ status: 201, description: 'Meta option created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @Post()
  create(@Body() createMetaOptionDto: CreateMetaOptionDto) {
    return this.metaOptionService.create(createMetaOptionDto);
  }
  //#endregion

  //#region GET /meta-option
  /**
   * Lists meta options one page at a time.
   * @param query page/limit
   */
  @ApiOperation({ summary: 'List all meta options' })
  @ApiResponse({ status: 200, description: 'Meta options returned' })
  @Get()
  findAll(@Query() query: GetMetaOptionsDto) {
    return this.metaOptionService.findAll(query);
  }
  //#endregion

  //#region GET /meta-option/:id
  /**
   * Gets a meta option by id.
   * @param id meta option id
   */
  @ApiOperation({ summary: 'Get a meta option by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Meta option returned' })
  @ApiResponse({ status: 404, description: 'Meta option not found' })
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
  @ApiOperation({ summary: 'Update a meta option' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Meta option updated' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Meta option not found' })
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
  @ApiOperation({ summary: 'Delete a meta option' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Meta option deleted' })
  @ApiResponse({ status: 404, description: 'Meta option not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metaOptionService.remove(+id);
  }
  //#endregion
}
