import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/providers/users.service';

/** Business logic for posts. */
@Injectable()
export class PostsService {
  /**
   * Creates the service.
   * @param userService used to validate that a post's owner exists
   */
  constructor(private readonly userService: UsersService) {}

  /**
   * Creates a post.
   * @param createPostDto post data
   */
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  /** Lists all posts. */
  findAll() {
    return `This action returns all posts`;
  }

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

  /**
   * Finds a single post by id.
   * @param id post id
   */
  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  /**
   * Updates a post.
   * @param id post id
   * @param updatePostDto fields to update
   */
  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  /**
   * Removes a post.
   * @param id post id
   */
  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
