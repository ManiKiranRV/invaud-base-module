import { Test, TestingModule } from '@nestjs/testing';
import { mock, mockDeep, MockProxy } from 'jest-mock-extended';
import { DataTransformerService } from '../../../data-transformer/data-transformer.service';
import { InvoicesService } from '../../../invoices/invoices.service';
import { RulesEngineService } from '../../../rules-engine/rules-engine.service';
import { ProducerService } from '../../producer/producer.service';
import { ForwarderConsumerService } from './forwarder-consumer.service';

export type Context = {
  invoicesService: InvoicesService;
  dataTransformerService: InvoicesService;
  rulesEngineService: RulesEngineService;
  producerService: ProducerService;
};

export type MockContext = {
  invoicesService: MockProxy<InvoicesService>;
  dataTransformerService: MockProxy<DataTransformerService>;
  rulesEngineService: MockProxy<RulesEngineService>;
  producerService: MockProxy<ProducerService>;
};

export const createMockContext = (): MockContext => {
  return {
    invoicesService: mockDeep<InvoicesService>(),
    dataTransformerService: mockDeep<DataTransformerService>(),
    rulesEngineService: mockDeep<RulesEngineService>(),
    producerService: mockDeep<ProducerService>(),
  };
};

describe('ForwarderConsumerService', () => {
  let service: ForwarderConsumerService;
  let context: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    context = createMockContext();
    ctx = context as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForwarderConsumerService,
        { provide: InvoicesService, useValue: ctx.invoicesService },
        {
          provide: DataTransformerService,
          useValue: ctx.dataTransformerService,
        },
        {
          provide: RulesEngineService,
          useValue: ctx.rulesEngineService,
        },
        {
          provide: ProducerService,
          useValue: ctx.producerService,
        },
      ],
    }).compile();

    service = module.get<ForwarderConsumerService>(ForwarderConsumerService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
