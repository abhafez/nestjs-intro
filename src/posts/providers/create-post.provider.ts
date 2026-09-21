import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { handleDatabaseError } from '../../app/database/database-error.handler';
import { UsersService } from '../../users/providers/users.service';
import { TagsService } from '../../tags/providers/tags.service';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { Post } from '../post.entity';
import { MetaOption } from '../../meta-option/entities/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';

/**
 * Writes new posts.
 *
 * Split out of `PostsService` because creation is the only operation that has to reconcile three
 * sources at once - the signed-in author, the tag set and the cascade-inserted meta option - and
 * that logic was crowding out the plain CRUD around it.
 */
@Injectable()
export class CreatePostProvider {
  /**
   * Creates the provider.
   * @param userService resolves the author named by the token's `sub` claim
   * @param tagService resolves the tag ids sent with the post
   * @param paginationProvider unused here; kept so the provider matches the service's shape
   * @param postRepository repository for posts
   * @param metaOptionRepository repository for meta options
   */
  constructor(
    private readonly userService: UsersService,

    private readonly tagService: TagsService,

    private readonly paginationProvider: PaginationProvider,

    /** Repository for {@link Post}. */
    @InjectRepository(Post)
    public readonly postRepository: Repository<Post>,

    /** Repository for {@link MetaOption}. */
    @InjectRepository(MetaOption)
    public readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  /**
   * Writes a post owned by the signed-in user.
   *
   * The author and the tags are resolved before anything is inserted, so a bad author or an
   * unknown tag id fails the request without leaving a half-written post behind.
   *
   * @param createPostDto the post to write; it carries no author
   * @param user token payload of the caller, whose `sub` becomes the post's author
   * @returns the saved post, with its author, tags and meta option attached
   * @throws ConflictException when the author or one of the tags could not be looked up,
   *   or when the slug collides with an existing post
   * @throws BadRequestException when one or more of the given tag ids do not exist
   */
  async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author, tags;
    try {
      // Both lookups raise their own NotFound/BadRequest, so an invalid author or tag
      // fails before we write anything.
      author = await this.userService.findOneById(user.sub);

      tags = await this.tagService.findMultipleTags(createPostDto.tags);
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto.tags.length !== tags.length) {
      throw new BadRequestException();
    }

    try {
      const post = this.postRepository.create({ ...createPostDto, author, tags });

      return await this.postRepository.save(post);
    } catch (error) {
      handleDatabaseError(error, 'creating the post');
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not a duplicate',
      });
    }
  }
}
