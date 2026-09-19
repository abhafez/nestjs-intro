import { Test, TestingModule } from '@nestjs/testing';
import { MetaOptionService } from './meta-option.service';

describe('MetaOptionService', () => {
  let service: MetaOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetaOptionService],
    }).compile();

    service = module.get<MetaOptionService>(MetaOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
