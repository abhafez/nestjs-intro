import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PatchPostDto } from './dto/patch-post.dto';

/** Post CRUD routes. */
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //#region POST /posts
  /**
   * Creates a post.
   * @param createPostDto post data
   */
  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({ status: 201, description: 'Post created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }
  //#endregion

  //#region GET /posts
  /** Lists all posts. */
  @ApiOperation({ summary: 'List all posts' })
  @ApiResponse({ status: 200, description: 'Posts returned' })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }
  //#endregion

  //#region GET /posts/user/:id
  /**
   * Lists the posts belonging to a user.
   * @param id user id
   */
  @ApiOperation({ summary: "List a user's posts" })
  @ApiParam({ name: 'id', type: Number, description: 'User id' })
  @ApiResponse({ status: 200, description: "User's posts returned" })
  @Get('user/:id')
  getAllForUser(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findAllForUser(id);
  }
  //#endregion

  //#region GET /posts/:id
  /**
   * Gets a post by id.
   * @param id post id
   */
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Post returned' })
  @ApiResponse({ status: 404, description: 'Post not found' })
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
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Post updated' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Post not found' })
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
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Post deleted' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
  //#endregion
}
