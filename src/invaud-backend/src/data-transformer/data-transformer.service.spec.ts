import { Test, TestingModule } from '@nestjs/testing';
import { DataTransformerService } from './data-transformer.service';

describe('DataTransformerService', () => {
  let service: DataTransformerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataTransformerService],
    }).compile();

    service = module.get<DataTransformerService>(DataTransformerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
