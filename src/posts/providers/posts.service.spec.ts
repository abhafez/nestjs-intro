import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { UsersService } from '../../users/providers/users.service';
import { Post } from '../post.entity';
import { MetaOption } from '../../meta-option/entities/meta-option.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PaginationProvider, useValue: { paginateQuery: jest.fn() } },
        { provide: UsersService, useValue: { findOneById: jest.fn() } },
        { provide: TagsService, useValue: { findMultipleTags: jest.fn() } },
        { provide: getRepositoryToken(Post), useValue: {} },
        { provide: getRepositoryToken(MetaOption), useValue: {} },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
