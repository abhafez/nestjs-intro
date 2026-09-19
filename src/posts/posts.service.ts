import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

/** Business logic for posts. */
@Injectable()
export class PostsService {
  /**
   * Creates the service.
   * @param userService used to validate that a post's owner exists
   */
  constructor(
    private readonly userService: UsersService,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  /**
   * Creates a post.
   * @param createPostDto post data
   */
  //#region create
  async create(createPostDto: CreatePostDto) {
    // if user exists
    const existingUser = await this.postRepository.findOne({
      where: { title: createPostDto.title },
    });
    // handle exceptions
    if (existingUser) {
      return null;
    }
    // create a new user
    let newPost = this.postRepository.create(createPostDto);
    // save to database
    newPost = await this.postRepository.save(newPost);

    return newPost;
  }
  //#endregion

  //#region findAll
  /** Lists all posts. */
  findAll() {
    return `This action returns all posts`;
  }
  //#endregion

  //#region findAllForUser
  /**
   * Lists the posts belonging to a user.
   * @param id user id
   */
  findAllForUser(id: number) {
    if (this.userService.findOneById(id)) {
      return [{ title: 'hello' }, { title: 'world' }];
    }
    return `This action returns a #${id} post`;
  }
  //#endregion

  //#region findOne
  /**
   * Finds a single post by id.
   * @param id post id
   */
  findOne(id: number) {
    return `This action returns a #${id} post`;
  }
  //#endregion

  //#region update
  /**
   * Updates a post.
   * @param id post id
   * @param updatePostDto fields to update
   */
  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }
  //#endregion

  //#region remove
  /**
   * Removes a post.
   * @param id post id
   */
  remove(id: number) {
    return `This action removes a #${id} post`;
  }
  //#endregion
}
