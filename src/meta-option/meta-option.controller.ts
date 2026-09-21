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
import { MetaOptionService } from './providers/meta-option.service';
import { CreateMetaOptionDto } from './dto/create-meta-option.dto';
import { UpdateMetaOptionDto } from './dto/update-meta-option.dto';
import { GetMetaOptionsDto } from './dto/get-meta-options.dto';
import { MetaOption } from './entities/meta-option.entity';
import { ApiPaginatedResponse } from '../common/pagination/decorators/api-paginated-response.decorator';
import { ApiErrorResponseDto } from '../common/dto/api-error-response.dto';
import { ValidationErrorResponseDto } from '../common/dto/validation-error-response.dto';

/** Meta option CRUD routes. */
@ApiTags('Meta Options')
@ApiServiceUnavailableResponse({
  description: 'The database was unreachable or the query failed unexpectedly.',
  type: ApiErrorResponseDto,
})
@Controller('meta-option')
export class MetaOptionController {
  constructor(private readonly metaOptionService: MetaOptionService) {}

  //#region POST /meta-option
  /**
   * Creates a meta option.
   * @param createMetaOptionDto meta option data
   */
  @ApiOperation({
    summary: 'Create a meta option',
    description:
      'Creates a standalone meta option with no post attached. To attach one at creation time, send `metaOptions` ' +
      'on `POST /posts` instead - the relation is one-to-one and cascade-inserted.',
  })
  @ApiBody({
    type: CreateMetaOptionDto,
    examples: {
      text: { summary: 'Plain string value', value: { metaValue: 'elit quis labore tempor eiusmod' } },
      json: { summary: 'JSON-encoded value', value: { metaValue: '{"readingTime":"4 min"}' } },
    },
  })
  @ApiCreatedResponse({ description: 'The meta option that was written.', type: MetaOption })
  @ApiBadRequestResponse({ description: 'Validation failed.', type: ValidationErrorResponseDto })
  @ApiConflictResponse({ description: 'A required column was left null.', type: ApiErrorResponseDto })
  @Post()
  create(@Body() createMetaOptionDto: CreateMetaOptionDto) {
    return this.metaOptionService.create(createMetaOptionDto);
  }
  //#endregion

  //#region GET /meta-option
  /**
   * Lists meta options one page at a time.
   * @param query pagination and date-range filters
   */
  @ApiOperation({
    summary: 'List all meta options',
    description:
      'Returns one page of meta options in the standard `data`/`meta`/`links` envelope. ' +
      '`startDate` and `endDate` are validated but not yet applied to the query.',
  })
  @ApiPaginatedResponse(MetaOption, 'One page of meta options.')
  @ApiBadRequestResponse({ description: 'A query parameter failed validation.', type: ValidationErrorResponseDto })
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
  @ApiOperation({
    summary: 'Get a meta option by id',
    description: 'Returns the meta option on its own; the owning post is not loaded with it.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the meta option to fetch.', example: 1 })
  @ApiOkResponse({ description: 'The requested meta option.', type: MetaOption })
  @ApiNotFoundResponse({ description: 'No meta option has that id.', type: ApiErrorResponseDto })
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
  @ApiOperation({
    summary: 'Update a meta option',
    description: 'Every field is optional; omitted fields keep their current value.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the meta option to update.', example: 1 })
  @ApiBody({
    type: UpdateMetaOptionDto,
    examples: {
      revalue: { summary: 'Replace the stored value', value: { metaValue: 'dolore magna' } },
    },
  })
  @ApiOkResponse({ description: 'The updated meta option.', type: MetaOption })
  @ApiBadRequestResponse({ description: 'Validation failed.', type: ValidationErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No meta option has that id.', type: ApiErrorResponseDto })
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
  @ApiOperation({
    summary: 'Delete a meta option',
    description: 'Hard-deletes the row. Deleting the owning post removes it too, via `ON DELETE CASCADE`.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the meta option to delete.', example: 1 })
  @ApiOkResponse({
    description: 'Confirmation that the meta option was deleted.',
    schema: { example: { deleted: true, id: 1 } },
  })
  @ApiNotFoundResponse({ description: 'No meta option has that id.', type: ApiErrorResponseDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metaOptionService.remove(+id);
  }
  //#endregion
}
