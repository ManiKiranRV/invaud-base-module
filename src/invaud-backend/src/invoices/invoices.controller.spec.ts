import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { ChargeLineDto } from './dto/charge-line.dto';
import { CreateOrUpdateChargeLineDto } from './dto/create-update-charge-line.dto';
import { InvoiceOverviewDto } from './dto/invoice-overview.dto';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

describe('InvoicesController', () => {
  let controller: InvoicesController;

  const mockInvoice = mock<InvoiceDto>();
  const mockInvoiceOverview = mock<InvoiceOverviewDto>();
  const mockPaginatedInvoiceOverview = {
    data: [mockInvoiceOverview, mockInvoiceOverview],
    numberOfRecords: 2,
  };
  const mockChargeLine = mock<ChargeLineDto>();
  const mockPaginatedChargeLines = {
    data: [mockChargeLine, mockChargeLine],
    numberOfRecords: 2,
  };
  const nonExistingInvoiceNumber = 'nonExisting_invoiceNumber';

  const mockInvoicesService = {
    getInvoiceOverviews: jest
      .fn()
      .mockImplementation(() => mockPaginatedInvoiceOverview),

    getInvoice: jest.fn().mockImplementation((id) => {
      if (id === nonExistingInvoiceNumber) {
        return null;
      }
      return mockInvoice;
    }),

    getChargeLinesForInvoice: jest
      .fn()
      .mockImplementation(() => mockPaginatedChargeLines),

    addAdditionalChargeLineToInvoice: jest
      .fn()
      .mockImplementation(
        (id: string, createChargeLineDto: CreateOrUpdateChargeLineDto) => {
          return mockChargeLine;
        },
      ),

    approveAdditionalCharge: jest.fn().mockImplementation((id: string) => {
      return mockChargeLine;
    }),

    rejectAdditionalCharge: jest.fn().mockImplementation((id: string) => {
      return mockChargeLine;
    }),

    amendAdditionalCharge: jest
      .fn()
      .mockImplementation(
        (id: string, updateChargeLineDto: CreateOrUpdateChargeLineDto) => {
          return mockChargeLine;
        },
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [InvoicesService],
    })
      .overrideProvider(InvoicesService)
      .useValue(mockInvoicesService)
      .compile();

    controller = module.get<InvoicesController>(InvoicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all invoice overviews', async () => {
    const result = await controller.getInvoiceOverviews({});
    expect(result).toEqual(mockPaginatedInvoiceOverview);
    expect(mockInvoicesService.getInvoiceOverviews).toHaveBeenCalled();
  });

  it('should get one invoice by invoice number', async () => {
    const result = await controller.getInvoiceById(mockInvoice.invoiceNumber);
    expect(result).toEqual(mockInvoice);
    expect(mockInvoicesService.getInvoice).toHaveBeenCalled();
  });

  it('should fail to get one invoice with non-existing invoice number', async () => {
    expect(controller.getInvoiceById(nonExistingInvoiceNumber)).rejects.toThrow(
      new NotFoundException(),
    );
    expect(mockInvoicesService.getInvoice).toHaveBeenCalled();
  });

  it('should get all charge lines for invoice', async () => {
    const result = await controller.getChargeLinesForInvoice(
      mockInvoice.invoiceNumber,
      {},
    );
    expect(result).toEqual(mockPaginatedChargeLines);
    expect(mockInvoicesService.getChargeLinesForInvoice).toHaveBeenCalled();
  });

  it('should add charge line to invoice', async () => {
    const result = await controller.addAdditionalChargeLineToInvoice(
      mockInvoice.invoiceNumber,
      mockChargeLine,
    );
    expect(result).toEqual(mockChargeLine);
    expect(
      mockInvoicesService.addAdditionalChargeLineToInvoice,
    ).toHaveBeenCalled();
  });

  it('should approve charge line', async () => {
    const result = await controller.approveChargeLine(mockChargeLine.id);
    expect(result).toEqual(mockChargeLine);
    expect(mockInvoicesService.approveAdditionalCharge).toHaveBeenCalled();
  });

  it('should reject charge line', async () => {
    const result = await controller.rejectChargeLine(mockChargeLine.id);
    expect(result).toEqual(mockChargeLine);
    expect(mockInvoicesService.rejectAdditionalCharge).toHaveBeenCalled();
  });

  it('should amend charge line', async () => {
    const result = await controller.amendChargeLine(
      mockChargeLine.id,
      mockChargeLine,
    );
    expect(result).toEqual(mockChargeLine);
    expect(mockInvoicesService.amendAdditionalCharge).toHaveBeenCalled();
  });
});
