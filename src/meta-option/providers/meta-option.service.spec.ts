import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MetaOptionService } from './meta-option.service';
import { MetaOption } from '../entities/meta-option.entity';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';

describe('MetaOptionService', () => {
  let service: MetaOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetaOptionService,
        { provide: PaginationProvider, useValue: { paginateQuery: jest.fn() } },
        { provide: getRepositoryToken(MetaOption), useValue: {} },
      ],
    }).compile();

    service = module.get<MetaOptionService>(MetaOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
