import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './providers/tags.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { PaginationProvider } from '../common/pagination/providers/pagination.provider';

describe('TagsController', () => {
  let controller: TagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        TagsService,
        { provide: PaginationProvider, useValue: { paginateQuery: jest.fn() } },
        { provide: getRepositoryToken(Tag), useValue: {} },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
