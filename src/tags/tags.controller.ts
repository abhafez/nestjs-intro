import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

/** Tag CRUD routes. */
@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  /**
   * Creates a tag.
   * @param createTagDto tag data
   */
  @ApiOperation({ summary: 'Create a tag' })
  @ApiResponse({ status: 201, description: 'Tag created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  /** Lists all tags. */
  @ApiOperation({ summary: 'List all tags' })
  @ApiResponse({ status: 200, description: 'Tags returned' })
  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  /**
   * Gets a tag by id.
   * @param id tag id
   */
  @ApiOperation({ summary: 'Get a tag by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tag returned' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  /**
   * Updates a tag.
   * @param id tag id
   * @param updateTagDto fields to update
   */
  @ApiOperation({ summary: 'Update a tag' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tag updated' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  /**
   * Deletes a tag.
   * @param id tag id
   */
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tag deleted' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
