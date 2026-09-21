import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { PatchPostDto } from '../dto/patch-post.dto';
import { UsersService } from '../../users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from '../../meta-option/entities/meta-option.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { Tag } from '../../tags/entities/tag.entity';
import { handleDatabaseError } from '../../app/database/database-error.handler';
import { GetPostsDto } from '../dto/get-posts.dto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';

/** Business logic for posts. */
@Injectable()
export class PostsService {
  /**
   * Creates the service.
   * @param userService used to validate that a post's owner exists
   * @param tagService used to resolve the tag ids attached to a post
   * @param paginationProvider turns a query into a paginated response
   * @param postRepository repository for posts
   * @param metaOptionRepository repository for meta options
   */
  constructor(
    private readonly userService: UsersService,

    private readonly tagService: TagsService,

    private readonly paginationProvider: PaginationProvider,

    private readonly createPostProvider: CreatePostProvider,

    /** Repository for {@link Post}. */
    @InjectRepository(Post)
    public readonly postRepository: Repository<Post>,

    /** Repository for {@link MetaOption}. */
    @InjectRepository(MetaOption)
    public readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  //#region create
  /**
   * Creates a post.
   * @param createPostDto post data
   * @param user
   * @throws NotFoundException when the author does not exist
   * @throws BadRequestException when one or more of the given tag ids do not exist
   * @throws RequestTimeoutException when the database is unreachable
   */
  async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    return this.createPostProvider.create(createPostDto, user);
  }
  //#endregion

  //#region findAll
  /**
   * Lists all posts.
   * @param query pagination options
   * @throws RequestTimeoutException when the database is unreachable
   */
  async findAll(query: GetPostsDto) {
    try {
      return await this.paginationProvider.paginateQuery(query, this.postRepository);
    } catch (error) {
      handleDatabaseError(error, 'listing posts');
    }
  }
  //#endregion

  //#region findAllForUser
  /**
   * Lists the posts belonging to a user.
   * @param id user id
   * @param query pagination options
   * @throws NotFoundException when the user does not exist
   * @throws RequestTimeoutException when the database is unreachable
   */
  async findAllForUser(id: number, query: GetPostsDto) {
    await this.userService.findOneById(id);

    try {
      return await this.paginationProvider.paginateQuery(query, this.postRepository, {
        where: { author: { id } },
      });
    } catch (error) {
      handleDatabaseError(error, "listing the user's posts");
    }
  }
  //#endregion

  //#region findOne
  /**
   * Finds a single post by id.
   * @param id post id
   * @throws NotFoundException when no post has that id
   * @throws RequestTimeoutException when the database is unreachable
   */
  async findOne(id: number) {
    let post: Post | null;

    try {
      post = await this.postRepository.findOneBy({ id });
    } catch (error) {
      handleDatabaseError(error, 'looking up the post');
    }

    if (!post) {
      throw new NotFoundException(`Post with id ${id} was not found.`);
    }

    return post;
  }
  //#endregion

  //#region update
  /**
   * Updates a post.
   * @param id post id
   * @param patchPostDto fields to update
   * @throws NotFoundException when the post does not exist
   * @throws BadRequestException when one or more of the given tag ids do not exist
   * @throws RequestTimeoutException when the database is unreachable
   */
  async update(id: number, patchPostDto: PatchPostDto) {
    let tags: Tag[] | undefined = undefined;

    // Resolve the tags first, so an invalid tag id fails before we touch the post.
    if (patchPostDto.tags) {
      tags = await this.tagService.findMultipleTags(patchPostDto.tags);
    }

    const post = await this.findOne(id);

    // Only overwrite the fields the caller actually sent.
    post.title = patchPostDto.title ?? post.title;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.status = patchPostDto.status ?? post.status;
    post.content = patchPostDto.content ?? post.content;
    post.schema = patchPostDto.schema ?? post.schema;
    post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;
    post.tags = tags ?? post.tags;

    try {
      return await this.postRepository.save(post);
    } catch (error) {
      handleDatabaseError(error, 'updating the post');
    }
  }
  //#endregion

  //#region remove
  /**
   * Removes a post.
   * @param id post id
   * @throws NotFoundException when no post has that id
   * @throws RequestTimeoutException when the database is unreachable
   */
  async remove(id: number) {
    try {
      const result = await this.postRepository.delete(id);

      if (!result.affected) {
        throw new NotFoundException(`Post with id ${id} was not found.`);
      }
    } catch (error) {
      handleDatabaseError(error, 'deleting the post');
    }

    return {
      deleted: true,
      id,
    };
  }
  //#endregion
}
