import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { UsersService } from '../users/providers/users.service';
import { Post } from './post.entity';
import { MetaOption } from '../meta-option/entities/meta-option.entity';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: UsersService, useValue: { findOneById: jest.fn() } },
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
