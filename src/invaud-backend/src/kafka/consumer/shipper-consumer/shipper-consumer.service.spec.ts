import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep, MockProxy } from 'jest-mock-extended';
import { InvoicesService } from '../../../invoices/invoices.service';
import { ShipperConsumerService } from './shipper-consumer.service';

export type Context = {
  invoicesService: InvoicesService;
};

export type MockContext = {
  invoicesService: MockProxy<InvoicesService>;
};

export const createMockContext = (): MockContext => {
  return {
    invoicesService: mockDeep<InvoicesService>(),
  };
};

describe('ShipperConsumerService', () => {
  let service: ShipperConsumerService;
  let context: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    context = createMockContext();
    ctx = context as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipperConsumerService,
        { provide: InvoicesService, useValue: ctx.invoicesService },
      ],
    }).compile();

    service = module.get<ShipperConsumerService>(ShipperConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
