import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post as HttpPost, Query } from '@nestjs/common';
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
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PatchPostDto } from './dto/patch-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { Post } from './post.entity';
import { ApiPaginatedResponse } from '../common/pagination/decorators/api-paginated-response.decorator';
import { ApiErrorResponseDto } from '../common/dto/api-error-response.dto';
import { ValidationErrorResponseDto } from '../common/dto/validation-error-response.dto';
import { PostStatus } from './enums/post-status.enum';
import { PostType } from './enums/post-type.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

/** Post CRUD routes. */
@ApiTags('Posts')
@ApiServiceUnavailableResponse({
  description: 'The database was unreachable or the query failed unexpectedly.',
  type: ApiErrorResponseDto,
})
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //#region POST /posts
  /**
   * Creates a post.
   * @param createPostDto post data
   * @param user
   */
  @ApiOperation({
    summary: 'Create a post',
    description:
      'Validates the author and every tag id before writing. `metaOptions` is a single object, not an array - ' +
      'the post/meta-option relation is one-to-one and the meta option is cascade-inserted with the post.',
  })
  @ApiBody({
    type: CreatePostDto,
    examples: {
      minimal: {
        summary: 'Minimal - only the required fields',
        value: {
          title: 'Getting started with NestJS providers',
          postType: PostType.POST,
          slug: 'getting-started-with-nestjs-providers',
          status: PostStatus.DRAFT,
          authorId: 1,
        },
      },
      full: {
        summary: 'Full - every optional field populated',
        value: {
          title: 'Getting started with NestJS providers',
          postType: PostType.POST,
          slug: 'getting-started-with-nestjs-providers',
          status: PostStatus.PUBLISHED,
          content: 'Providers are the backbone of dependency injection in NestJS...',
          schema: '{"@context":"https://schema.org","@type":"BlogPosting"}',
          featuredImageUrl: 'https://example.com/images/providers.png',
          publishOn: '2026-10-01T08:00:00.000Z',
          tags: [1, 2],
          metaOptions: { metaValue: 'elit quis labore tempor eiusmod' },
          authorId: 1,
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'The post that was written, with its author, tags and meta option.', type: Post })
  @ApiBadRequestResponse({ description: 'Validation failed.', type: ValidationErrorResponseDto })
  @ApiNotFoundResponse({ description: 'The author id does not exist.', type: ApiErrorResponseDto })
  @ApiConflictResponse({
    description: 'A post with the same slug already exists, or a required column was left null.',
    type: ApiErrorResponseDto,
  })
  @HttpPost()
  create(@Body() createPostDto: CreatePostDto, @ActiveUser() user: ActiveUserData) {
    return this.postsService.create(createPostDto, user);
  }
  //#endregion

  //#region GET /posts
  /**
   * Lists posts one page at a time.
   * @param postQuery pagination and date-range filters
   */
  @ApiOperation({
    summary: 'List all posts',
    description:
      'Returns one page of posts wrapped in the standard `data`/`meta`/`links` envelope. ' +
      '`startDate` and `endDate` are validated but not yet applied to the query.',
  })
  @ApiPaginatedResponse(Post, 'One page of posts, newest first as stored.')
  @ApiBadRequestResponse({ description: 'A query parameter failed validation.', type: ValidationErrorResponseDto })
  @Auth(AuthType.None)
  @Get()
  findAll(@Query() postQuery: GetPostsDto) {
    return this.postsService.findAll(postQuery);
  }
  //#endregion

  //#region GET /posts/user/:id
  /**
   * Lists the posts belonging to a user.
   * @param id user id
   * @param postQuery pagination and date-range filters
   */
  @ApiOperation({
    summary: "List a user's posts",
    description: 'Confirms the user exists, then returns their posts in the same paginated envelope as `GET /posts`.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the author whose posts to list.', example: 1 })
  @ApiPaginatedResponse(Post, "One page of the user's posts.")
  @ApiBadRequestResponse({ description: 'The id is not an integer.', type: ValidationErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No user has that id.', type: ApiErrorResponseDto })
  @Get('user/:id')
  getAllForUser(@Param('id', ParseIntPipe) id: number, @Query() postQuery: GetPostsDto) {
    return this.postsService.findAllForUser(id, postQuery);
  }
  //#endregion

  //#region GET /posts/:id
  /**
   * Gets a post by id.
   * @param id post id
   */
  @ApiOperation({
    summary: 'Get a post by id',
    description: 'Author, tags and meta option are eagerly loaded and returned with the post.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the post to fetch.', example: 1 })
  @ApiOkResponse({ description: 'The requested post.', type: Post })
  @ApiNotFoundResponse({ description: 'No post has that id.', type: ApiErrorResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }
  //#endregion

  //#region PATCH /posts/:id
  /**
   * Updates a post.
   * @param id post id
   * @param patchPostDto fields to update
   */
  @ApiOperation({
    summary: 'Update a post',
    description:
      'Every field is optional; omitted fields keep their current value. Sending `tags` replaces the whole tag set.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the post to update.', example: 1 })
  @ApiBody({
    type: PatchPostDto,
    examples: {
      retitle: {
        summary: 'Rename a post',
        value: { id: '1', title: 'A clearer title for the same post' },
      },
      publish: {
        summary: 'Publish it and replace its tags',
        value: { id: '1', status: PostStatus.PUBLISHED, tags: [1, 3] },
      },
    },
  })
  @ApiOkResponse({ description: 'The updated post.', type: Post })
  @ApiBadRequestResponse({
    description: 'Validation failed, or one of the tag ids does not exist.',
    type: ValidationErrorResponseDto,
  })
  @ApiNotFoundResponse({ description: 'No post has that id.', type: ApiErrorResponseDto })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() patchPostDto: PatchPostDto) {
    return await this.postsService.update(+id, patchPostDto);
  }
  //#endregion

  //#region DELETE /posts/:id
  /**
   * Deletes a post.
   * @param id post id
   */
  @ApiOperation({
    summary: 'Delete a post',
    description: 'Hard-deletes the row. The attached meta option is removed with it via `ON DELETE CASCADE`.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Id of the post to delete.', example: 1 })
  @ApiOkResponse({
    description: 'Confirmation that the post was deleted.',
    schema: { example: { deleted: true, id: 1 } },
  })
  @ApiNotFoundResponse({ description: 'No post has that id.', type: ApiErrorResponseDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
  //#endregion
}
