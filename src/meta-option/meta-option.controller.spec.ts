import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MetaOptionController } from './meta-option.controller';
import { MetaOptionService } from './providers/meta-option.service';
import { MetaOption } from './entities/meta-option.entity';
import { PaginationProvider } from '../common/pagination/providers/pagination.provider';

describe('MetaOptionController', () => {
  let controller: MetaOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetaOptionController],
      providers: [
        MetaOptionService,
        { provide: PaginationProvider, useValue: { paginateQuery: jest.fn() } },
        { provide: getRepositoryToken(MetaOption), useValue: {} },
      ],
    }).compile();

    controller = module.get<MetaOptionController>(MetaOptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
