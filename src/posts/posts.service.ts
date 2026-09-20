import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { MetaOption } from '../meta-option/entities/meta-option.entity';

/** Business logic for posts. */
@Injectable()
export class PostsService {
  /**
   * Creates the service.
   * @param userService used to validate that a post's owner exists
   * @param postRepository
   * @param metaOptionRepository
   */
  constructor(
    private readonly userService: UsersService,

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

    if (author) {
      let post = this.postRepository.create({ ...createPostDto, author });

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
   * @param updatePostDto fields to update
   */
  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ id });

    if (post) {
      Object.assign(post, updatePostDto);

      return await this.postRepository.save(post);
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
