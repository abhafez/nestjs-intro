import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from '../users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(private readonly userService: UsersService) {}

  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAll() {
    return `This action returns all posts`;
  }

  findAllForUser(id: number) {
    if (this.userService.findOneById(id)) {
      return [{ title: 'hello' }, { title: 'world' }];
    }
    return `This action returns a #${id} post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
