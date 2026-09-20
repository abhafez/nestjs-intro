import { BadRequestException, Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PatchPostDto } from './dto/patch-post.dto';
import { UsersService } from '../users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { MetaOption } from '../meta-option/entities/meta-option.entity';
import { TagsService } from '../tags/tags.service';
import { Tag } from '../tags/entities/tag.entity';

/** Business logic for posts. */
@Injectable()
export class PostsService {
  /**
   * Creates the service.
   * @param userService used to validate that a post's owner exists
   * @param tagService
   * @param postRepository
   * @param metaOptionRepository
   */
  constructor(
    private readonly userService: UsersService,

    private readonly tagService: TagsService,

    @InjectRepository(Post)
    public readonly postRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    public readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  /**
   * Creates a post.
   * @param createPostDto post data
   */
  //#region create
  async create(createPostDto: CreatePostDto) {
    let author = await this.userService.findOneById(createPostDto.authorId);

    let tags = await this.tagService.findMultipleTags(createPostDto.tags);

    if (author) {
      let post = this.postRepository.create({ ...createPostDto, author, tags });

      return await this.postRepository.save(post);
    }
  }
  //#endregion

  //#region findAll
  /** Lists all posts. */
  async findAll() {
    return await this.postRepository.find();
  }
  //#endregion

  //#region findAllForUser
  /**
   * Lists the posts belonging to a user.
   * @param id user id
   */
  async findAllForUser(id: number) {
    return await this.postRepository.find({ where: { author: { id } } });
  }
  //#endregion

  //#region findOne
  /**
   * Finds a single post by id.
   * @param id post id
   */
  async findOne(id: number) {
    return await this.postRepository.findOneBy({ id });
  }
  //#endregion

  //#region update
  /**
   * Updates a post.
   * @param id post id
   * @param patchPostDto fields to update
   * @throws NotFoundException when the post or one of the given tags does not exist
   * @throws RequestTimeoutException when the database is unreachable
   */
  async update(id: number, patchPostDto: PatchPostDto) {
    let tags: Tag[] | undefined = undefined;
    let post: Post | null;

    // Find the tags first, so an invalid tag id fails before we touch the post.
    if (patchPostDto.tags) {
      try {
        tags = await this.tagService.findMultipleTags(patchPostDto.tags);
      } catch {
        throw new RequestTimeoutException('Unable to process your request at the moment, please try later.');
      }

      if (tags.length !== patchPostDto.tags.length) {
        throw new BadRequestException('One or more tag ids were not found, please check them and try again.');
      }
    }

    try {
      post = await this.postRepository.findOneBy({ id });
    } catch {
      throw new RequestTimeoutException('Unable to process your request at the moment, please try later.');
    }

    if (!post) {
      throw new NotFoundException(`Post with id ${id} was not found.`);
    }

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
    } catch {
      throw new RequestTimeoutException('Unable to process your request at the moment, please try later.');
    }
  }
  //#endregion

  //#region remove
  /**
   * Removes a post.
   * @param id post id
   */
  async remove(id: number) {
    await this.postRepository.delete(id);

    return {
      deleted: true,
      id,
    };
  }
  //#endregion
}
