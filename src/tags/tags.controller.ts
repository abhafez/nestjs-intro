import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAuth } from '../auth/decorators/api-auth.decorator';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetTagsDto } from './dto/get-tags.dto';
import { Tag } from './entities/tag.entity';
import { ApiPaginatedResponse } from '../common/pagination/decorators/api-paginated-response.decorator';
import { ApiErrorResponseDto } from '../common/dto/api-error-response.dto';
import { ValidationErrorResponseDto } from '../common/dto/validation-error-response.dto';

/** Tag CRUD routes. */
@ApiTags('Tags')
@ApiServiceUnavailableResponse({
  description: 'The database was unreachable or the query failed unexpectedly.',
  type: ApiErrorResponseDto,
})
@ApiAuth()
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  //#region POST /tags
  /**
   * Creates a tag.
   * @param createTagDto tag data
   */
  @ApiOperation({
    summary: 'Create a tag',
    description: 'Both `name` and `slug` are unique; reusing either returns a 409.',
  })
  @ApiBody({
    type: CreateTagDto,
    examples: {
      minimal: {
        summary: 'Minimal - only the required fields',
        value: { name: 'NestJS', slug: 'nestjs' },
      },
      full: {
        summary: 'Full - every optional field populated',
        value: {
          name: 'NestJS',
          slug: 'nestjs',
          description: 'Posts about the NestJS framework.',
          schema: '{"@context":"https://schema.org","@type":"Thing"}',
          featuredImage: 'https://example.com/images/nestjs.png',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'The tag that was written.', type: Tag })
  @ApiBadRequestResponse({ description: 'Validation failed.', type: ValidationErrorResponseDto })
  @ApiConflictResponse({ description: 'A tag with the same name or slug already exists.', type: ApiErrorResponseDto })
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }
  //#endregion

  //#region GET /tags
  /**
   * Lists tags one page at a time.
   * @param query pagination and date-range filters
   */
  @ApiOperation({
    summary: 'List all tags',
    description:
      'Returns one page of tags in the standard `data`/`meta`/`links` envelope. Soft-deleted tags are excluded. ' +
      '`startDate` and `endDate` are validated but not yet applied to the query.',
  })
  @ApiPaginatedResponse(Tag, 'One page of tags.')
  @ApiBadRequestResponse({ description: 'A query parameter failed validation.', type: ValidationErrorResponseDto })
  @Get()
  findAll(@Query() query: GetTagsDto) {
    return this.tagsService.findAll(query);
  }
  //#endregion

  //#region GET /tags/:id
  /**
   * Gets a tag by id.
   * @param id tag id
   */
  @ApiOperation({ summary: 'Get a tag by id', description: 'Soft-deleted tags are treated as missing.' })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the tag to fetch.', example: 1 })
  @ApiOkResponse({ description: 'The requested tag.', type: Tag })
  @ApiNotFoundResponse({ description: 'No tag has that id.', type: ApiErrorResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }
  //#endregion

  //#region PATCH /tags/:id
  /**
   * Updates a tag.
   * @param id tag id
   * @param updateTagDto fields to update
   */
  @ApiOperation({
    summary: 'Update a tag',
    description: 'Every field is optional; omitted fields keep their current value.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the tag to update.', example: 1 })
  @ApiBody({
    type: UpdateTagDto,
    examples: {
      rename: { summary: 'Rename a tag', value: { name: 'Nest.js' } },
      describe: {
        summary: 'Add a description and an image',
        value: {
          description: 'Posts about the NestJS framework.',
          featuredImage: 'https://example.com/images/nestjs.png',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'The updated tag.', type: Tag })
  @ApiBadRequestResponse({ description: 'Validation failed.', type: ValidationErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No tag has that id.', type: ApiErrorResponseDto })
  @ApiConflictResponse({ description: 'Another tag already uses that name or slug.', type: ApiErrorResponseDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }
  //#endregion

  //#region DELETE /tags/:id
  /**
   * Deletes a tag.
   * @param id tag id
   */
  @ApiOperation({
    summary: 'Delete a tag permanently',
    description: 'Hard-deletes the row. Use `DELETE /tags/{id}/soft` to keep it recoverable.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the tag to delete.', example: 1 })
  @ApiOkResponse({
    description: 'Confirmation that the tag was deleted.',
    schema: { example: { deleted: true, id: 1 } },
  })
  @ApiNotFoundResponse({ description: 'No tag has that id.', type: ApiErrorResponseDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
  //#endregion

  //#region DELETE /tags/:id/soft
  /**
   * Soft Deletes a tag.
   * @param id tag id
   */
  @ApiOperation({
    summary: 'Soft-delete a tag',
    description: 'Stamps `deletedAt` instead of removing the row, so the tag drops out of reads but stays recoverable.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the tag to soft-delete.', example: 1 })
  @ApiOkResponse({
    description: 'Confirmation that the tag was soft-deleted.',
    schema: { example: { deleted: true, id: 1 } },
  })
  @ApiNotFoundResponse({ description: 'No tag has that id.', type: ApiErrorResponseDto })
  @Delete(':id/soft')
  softRemove(@Param('id') id: string) {
    return this.tagsService.softRemove(+id);
  }
  //#endregion
}
