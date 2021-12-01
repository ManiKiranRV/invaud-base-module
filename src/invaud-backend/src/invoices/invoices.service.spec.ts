import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { ChargeLineStatus, ErrorType } from 'core';
import { mock, mockDeep, MockProxy } from 'jest-mock-extended';
import { DataTransformerService } from '../data-transformer/data-transformer.service';
import { DatabaseService } from '../database/database.service';
import { BusinessError } from '../errors/business.error';
import { ProducerService } from '../kafka/producer/producer.service';
import { ChargeLineDto } from './dto/charge-line.dto';
import { CreateOrUpdateChargeLineDto } from './dto/create-update-charge-line.dto';
import { InvoiceOverviewDto } from './dto/invoice-overview.dto';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoicesService } from './invoices.service';

export type Context = {
  prisma: PrismaClient;
  transformer: DataTransformerService;
  kafkaProducerService: ProducerService;
  configService: ConfigService;
};

export type MockContext = {
  prisma: MockProxy<PrismaClient>;
  transformer: MockProxy<DataTransformerService>;
  kafkaProducerService: MockProxy<ProducerService>;
  configService: MockProxy<ConfigService>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
    transformer: mockDeep<DataTransformerService>(),
    kafkaProducerService: mockDeep<ProducerService>(),
    configService: mockDeep<ConfigService>(),
  };
};

describe('InvoicesService', () => {
  let service: InvoicesService;
  let context: MockContext;
  let ctx: Context;

  const mockInvoice = mock<InvoiceDto>();
  const mockInvoiceOverview = mock<InvoiceOverviewDto>();
  const mockChargeLine = mock<ChargeLineDto>();
  const mockCreateChargeLine = mock<CreateOrUpdateChargeLineDto>();
  const mockPaginatedInvoiceOverview = {
    data: [mockInvoiceOverview, mockInvoiceOverview],
    numberOfRecords: 2,
  };
  const mockPaginatedChargeLines = {
    data: [mockChargeLine, mockChargeLine],
    numberOfRecords: 2,
  };

  beforeEach(async () => {
    context = createMockContext();
    ctx = context as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        { provide: DatabaseService, useValue: ctx.prisma },
        { provide: DataTransformerService, useValue: ctx.transformer },
        { provide: ProducerService, useValue: ctx.kafkaProducerService },
        { provide: ConfigService, useValue: ctx.configService },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all invoice overviews', async () => {
    const mockPrismaResponse = [2, [mockInvoiceOverview, mockInvoiceOverview]];
    context.prisma.$transaction.mockResolvedValue(mockPrismaResponse);
    const result = await service.getInvoiceOverviews({});
    return expect(result).toEqual(mockPaginatedInvoiceOverview);
  });

  it('should get invoice overview by id', async () => {
    context.prisma.invoiceOverview.findUnique.mockResolvedValue(
      mockInvoiceOverview,
    );
    const result = await service.getInvoiceOverviewById(
      mockInvoiceOverview.invoiceNumber,
    );
    return expect(result).toEqual(mockInvoiceOverview);
  });

  it('should create invoice overview', async () => {
    context.prisma.invoiceOverview.findUnique.mockResolvedValue(null);
    context.prisma.invoiceOverview.create.mockResolvedValue(
      mockInvoiceOverview,
    );
    const result = await service.createInvoiceOverview(mockInvoiceOverview);
    return expect(result).toEqual(mockInvoiceOverview);
  });

  it('should reject to create invoice overview', async () => {
    context.prisma.invoiceOverview.findUnique.mockResolvedValue(
      mockInvoiceOverview,
    );
    context.prisma.invoiceOverview.create.mockResolvedValue(
      mockInvoiceOverview,
    );
    return expect(
      service.createInvoiceOverview(mockInvoiceOverview),
    ).rejects.toThrowError(
      new BusinessError(
        ErrorType.Conflict,
        `Invoice ${mockInvoiceOverview.invoiceNumber} already exists`,
      ),
    );
  });

  it('should get invoice including nested by id', async () => {
    context.prisma.invoice.findUnique.mockResolvedValue(mockInvoice);
    const result = await service.getInvoice(mockInvoice.invoiceNumber);
    return expect(result).toEqual(mockInvoice);
  });

  it('should create invoice including nested', async () => {
    context.prisma.invoice.findUnique.mockResolvedValue(null);
    context.prisma.$transaction.mockResolvedValue([null, mockInvoice]);
    await service.createInvoice(mockInvoice);
    expect(context.prisma.$transaction).toBeCalledTimes(1);
  });

  it('should reject to create invoice', async () => {
    context.prisma.invoice.findUnique.mockResolvedValue(mockInvoice);
    context.prisma.invoice.create.mockResolvedValue(mockInvoice);
    return expect(service.createInvoice(mockInvoice)).rejects.toThrowError(
      new BusinessError(
        ErrorType.Conflict,
        `Invoice ${mockInvoice.invoiceNumber} already exists`,
      ),
    );
  });

  it('should get all charge lines for invoice', async () => {
    const mockPrismaResponse = [2, [mockChargeLine, mockChargeLine]];
    context.prisma.$transaction.mockResolvedValue(mockPrismaResponse);
    const result = await service.getChargeLinesForInvoice(
      mockInvoice.invoiceNumber,
      {},
    );
    return expect(result).toEqual(mockPaginatedChargeLines);
  });

  it('should add charge line to invoice', async () => {
    context.prisma.invoice.findUnique.mockResolvedValue(mockInvoice);
    context.prisma.chargeLine.create.mockResolvedValue(mockChargeLine);
    const result = await service.addAdditionalChargeLineToInvoice(
      mockInvoice.invoiceNumber,
      mockCreateChargeLine,
    );
    return expect(result).toEqual(mockChargeLine);
  });

  it('should reject to add charge line to non-existing invoice', async () => {
    context.prisma.invoice.findUnique.mockResolvedValue(null);
    return expect(
      service.addAdditionalChargeLineToInvoice(
        mockInvoice.invoiceNumber,
        mockCreateChargeLine,
      ),
    ).rejects.toThrowError(
      new BusinessError(
        ErrorType.Conflict,
        `Invoice ${mockInvoice.invoiceNumber} does not exist`,
      ),
    );
  });

  it('should throw BusinessError when adding an additional charge line to non-existing invoice', async () => {
    expect(
      service.addAdditionalChargeLineToInvoice(
        'nonExistingInvoiceNumber',
        mockChargeLine,
      ),
    ).rejects.toThrowError(BusinessError);
  });

  it('should return invoice number', async () => {
    const result = service.generateInvoiceNumber();
    return expect(result.length).toEqual(8);
  });

  it('should approve charge line', async () => {
    mockChargeLine.additionalCharge = true;
    mockChargeLine.status = ChargeLineStatus.Pending;
    context.prisma.chargeLine.findUnique.mockResolvedValue(mockChargeLine);
    context.prisma.chargeLine.update.mockResolvedValue(mockChargeLine);
    const result = await service.approveAdditionalCharge(mockChargeLine.id);
    return expect(result).toEqual(mockChargeLine);
  });

  it('should reject charge line', async () => {
    mockChargeLine.additionalCharge = true;
    mockChargeLine.status = ChargeLineStatus.Pending;
    context.prisma.chargeLine.findUnique.mockResolvedValue(mockChargeLine);
    context.prisma.chargeLine.update.mockResolvedValue(mockChargeLine);
    const result = await service.approveAdditionalCharge(mockChargeLine.id);
    return expect(result).toEqual(mockChargeLine);
  });

  it('should fail to approve charge line (not AD)', async () => {
    mockChargeLine.additionalCharge = false;
    mockChargeLine.status = ChargeLineStatus.Pending;
    context.prisma.chargeLine.findUnique.mockResolvedValue(mockChargeLine);
    context.prisma.chargeLine.update.mockResolvedValue(mockChargeLine);
    return expect(
      service.approveAdditionalCharge(mockChargeLine.id),
    ).rejects.toThrowError(
      new BusinessError(
        ErrorType.Conflict,
        `Charge line ${mockChargeLine.id} is not an additional charge`,
      ),
    );
  });

  it('should fail to approve charge line (not pending status)', async () => {
    mockChargeLine.additionalCharge = true;
    mockChargeLine.status = ChargeLineStatus.Rejected;
    context.prisma.chargeLine.findUnique.mockResolvedValue(mockChargeLine);
    context.prisma.chargeLine.update.mockResolvedValue(mockChargeLine);
    return expect(
      service.approveAdditionalCharge(mockChargeLine.id),
    ).rejects.toThrowError(
      new BusinessError(
        ErrorType.Conflict,
        `Charge line ${mockChargeLine.id} is not in a mutable state (requires pending status)`,
      ),
    );
  });

  it('should amend charge line', async () => {
    mockChargeLine.status = ChargeLineStatus.Rejected;
    context.prisma.chargeLine.findUnique.mockResolvedValue(mockChargeLine);
    context.prisma.chargeLine.update.mockResolvedValue(mockChargeLine);
    const result = await service.amendAdditionalCharge(
      mockChargeLine.id,
      mockChargeLine,
    );
    return expect(result).toEqual(mockChargeLine);
  });

  it('should fail to amend charge line (not rejected status)', async () => {
    mockChargeLine.status = ChargeLineStatus.Pending;
    context.prisma.chargeLine.findUnique.mockResolvedValue(mockChargeLine);
    context.prisma.chargeLine.update.mockResolvedValue(mockChargeLine);
    return expect(
      service.amendAdditionalCharge(mockChargeLine.id, mockChargeLine),
    ).rejects.toThrowError(
      new BusinessError(
        ErrorType.Conflict,
        `Charge line ${mockChargeLine.id} cannot be amended (not in rejected state)`,
      ),
    );
  });
});
