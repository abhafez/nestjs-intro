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

@Injectable()
export class CreatePostProvider {
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
