import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { ChargeLineStatus, ErrorType, InstanceType, Paginated } from 'core';
import { v4 as uuidv4 } from 'uuid';
import { DataTransformerService } from '../data-transformer/data-transformer.service';
import { DatabaseService } from '../database/database.service';
import { BusinessError } from '../errors/business.error';
import { ProducerService } from '../kafka/producer/producer.service';
import { ChargeLineDto } from './dto/charge-line.dto';
import { CreateOrUpdateChargeLineDto } from './dto/create-update-charge-line.dto';
import { CreateInvoiceOverviewDto } from './dto/create-invoice-overview.dto';
import { InvoiceOverviewDto } from './dto/invoice-overview.dto';
import { InvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoicesService implements OnModuleInit {
  constructor(
    private prisma: DatabaseService,
    private readonly transformer: DataTransformerService,
    private configService: ConfigService,
    private kafkaProducerService: ProducerService,
  ) {}

  private logger = new Logger(this.constructor.name);
  private instanceType: InstanceType;

  async getInvoiceOverviews(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.InvoiceOverviewWhereUniqueInput;
    where?: Prisma.InvoiceOverviewWhereInput;
    orderBy?:
      | Prisma.InvoiceOverviewOrderByInput
      | Prisma.InvoiceOverviewOrderByInput[];
  }): Promise<Paginated<InvoiceOverviewDto>> {
    const { skip, take, cursor, where, orderBy } = params;

    const transactionData = await this.prisma.$transaction([
      this.prisma.invoiceOverview.count({ where }),
      this.prisma.invoiceOverview.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
    ]);
    return {
      data: transactionData[1],
      numberOfRecords: transactionData[0],
    };
  }

  async getInvoiceOverviewById(id: string): Promise<InvoiceOverviewDto | null> {
    return this.prisma.invoiceOverview.findUnique({
      where: { invoiceNumber: id },
    });
  }

  async createInvoiceOverview(
    createInvoiceOverviewDto: CreateInvoiceOverviewDto,
  ): Promise<InvoiceOverviewDto> {
    const foundInvoiceOverview = await this.getInvoiceOverviewById(
      createInvoiceOverviewDto.invoiceNumber,
    );

    if (foundInvoiceOverview) {
      throw new BusinessError(
        ErrorType.Conflict,
        `Invoice ${createInvoiceOverviewDto.invoiceNumber} already exists`,
      );
    }

    this.logger.log('Invoice overview created');

    return this.prisma.invoiceOverview.create({
      data: {
        ...createInvoiceOverviewDto,
      },
    });
  }

  async getInvoice(invoiceNumber: string): Promise<InvoiceDto | null> {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        invoiceNumber,
      },
      include: {
        shipment: {
          include: { stations: true },
        },
        shipperAddress: true,
        consigneeAddress: true,
        billToPartyAddress: true,
        chainEvents: true,
        references: true,
        chargeLines: false,
        additionalDocuments: true,
      },
    });
    return invoice as InvoiceDto;
  }

  async createInvoice(invoiceDto: InvoiceDto): Promise<InvoiceDto> {
    const foundInvoice = await this.getInvoice(invoiceDto.invoiceNumber);

    if (foundInvoice) {
      throw new BusinessError(
        ErrorType.Conflict,
        `Invoice ${invoiceDto.invoiceNumber} already exists`,
      );
    }

    const {
      shipment,
      shipperAddress,
      consigneeAddress,
      billToPartyAddress,
      chainEvents,
      references,
      chargeLines,
      additionalDocuments,
      ...topLevelFields
    } = invoiceDto;

    const { stations, ...shipmentWithoutStations } = invoiceDto.shipment;

    const createShipment = () =>
      this.prisma.shipment.create({
        data: shipmentWithoutStations,
      });

    const createInvoice = () =>
      this.prisma.invoice.create({
        data: topLevelFields,
      });

    const createAddresses = () =>
      this.prisma.address.createMany({
        data: [
          invoiceDto.shipperAddress,
          invoiceDto.consigneeAddress,
          invoiceDto.billToPartyAddress,
        ],
      });

    const createChainEvents = () =>
      this.prisma.chainEvent.createMany({
        data: invoiceDto.chainEvents,
      });

    const createReferences = () =>
      this.prisma.reference.createMany({
        data: invoiceDto.references,
      });

    const createChargeLines = () =>
      this.prisma.chargeLine.createMany({
        data: invoiceDto.chargeLines,
      });

    const createAdditionalDocuments = () =>
      this.prisma.additionalDocument.createMany({
        data: invoiceDto.additionalDocuments,
      });

    const createStations = () =>
      this.prisma.station.createMany({
        data: invoiceDto.shipment.stations,
      });

    const transactionData = await this.prisma.$transaction([
      createShipment(),
      createInvoice(),
      createAddresses(),
      createChainEvents(),
      createReferences(),
      createChargeLines(),
      createAdditionalDocuments(),
      createStations(),
    ]);
    this.logger.log(`Invoice ${invoiceDto.invoiceNumber} created`);
    return transactionData[1] as InvoiceDto;
  }

  async createInvoiceAndOverview(invoiceDto: InvoiceDto): Promise<void> {
    await this.createInvoice(invoiceDto);
    const createInvoiceOverviewDto =
      this.transformer.invoiceDtoToCreateInvoiceOverviewDto(invoiceDto);

    await this.createInvoiceOverview(createInvoiceOverviewDto);
  }

  async getChargeLinesForInvoice(
    invoiceNumber: string,
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.ChargeLineWhereUniqueInput;
      where?: Prisma.ChargeLineWhereInput;
      orderBy?: Prisma.ChargeLineOrderByInput | Prisma.ChargeLineOrderByInput[];
    },
  ): Promise<Paginated<ChargeLineDto>> {
    const { skip, take, cursor, where, orderBy } = params;
    const whereEnriched = { ...where, invoiceNumber };

    const transactionData = await this.prisma.$transaction([
      this.prisma.chargeLine.count({ where: whereEnriched }),
      this.prisma.chargeLine.findMany({
        skip,
        take,
        cursor,
        where: whereEnriched,
        orderBy,
      }),
    ]);
    return {
      data: transactionData[1],
      numberOfRecords: transactionData[0],
    };
  }

  async addAdditionalChargeLineToInvoice(
    invoiceNumber: string,
    createChargeLine: CreateOrUpdateChargeLineDto,
  ): Promise<ChargeLineDto> {
    const foundInvoice = await this.getInvoice(invoiceNumber);

    if (!foundInvoice) {
      throw new BusinessError(
        ErrorType.NotFound,
        `Invoice ${invoiceNumber} does not exist`,
      );
    }

    const createdChargeLine = await this.prisma.chargeLine.create({
      data: {
        ...createChargeLine,
        additionalCharge: true,
        invoiceNumber: invoiceNumber,
        status: ChargeLineStatus.Pending,
      },
    });

    if (this.instanceType === InstanceType.Forwarder) {
      this.kafkaProducerService.produceAdditionalChargeAddedEvent(
        createdChargeLine,
      );
    }

    return createdChargeLine;
  }

  async approveAdditionalCharge(id: string): Promise<ChargeLineDto> {
    await this.chargeLineValidityCheck(id);

    const approvedChargeLine = await this.prisma.chargeLine.update({
      where: { id },
      data: {
        status: ChargeLineStatus.Approved,
      },
    });

    if (this.instanceType === InstanceType.Shipper) {
      this.kafkaProducerService.produceAdditionalChargeApprovedEvent(
        approvedChargeLine,
      );
    }

    return approvedChargeLine;
  }

  async rejectAdditionalCharge(id: string): Promise<ChargeLineDto> {
    await this.chargeLineValidityCheck(id);

    const rejectedChargeLine = await this.prisma.chargeLine.update({
      where: { id },
      data: {
        status: ChargeLineStatus.Rejected,
      },
    });

    if (this.instanceType === InstanceType.Shipper) {
      this.kafkaProducerService.produceAdditionalChargeRejectedEvent(
        rejectedChargeLine,
      );
    }

    return rejectedChargeLine;
  }

  async amendAdditionalCharge(
    id: string,
    amendedChargeLine: CreateOrUpdateChargeLineDto,
  ): Promise<ChargeLineDto> {
    const currentChargeLine = await this.findChargeLineById(id);

    if (!currentChargeLine) {
      throw new BusinessError(
        ErrorType.NotFound,
        `Charge line ${id} does not exist`,
      );
    }

    if (currentChargeLine.status != ChargeLineStatus.Rejected) {
      throw new BusinessError(
        ErrorType.Conflict,
        `Charge line ${id} cannot be amended (not in rejected state)`,
      );
    }

    const updatedChargeLine = await this.prisma.chargeLine.update({
      where: { id },
      data: {
        ...amendedChargeLine,
        status: ChargeLineStatus.Pending,
      },
    });

    if (this.instanceType === InstanceType.Forwarder) {
      this.kafkaProducerService.produceAdditionalChargeUpdatedEvent(
        updatedChargeLine,
      );
    }

    return updatedChargeLine;
  }

  generateInvoiceNumber(): string {
    return uuidv4().slice(0, 8);
  }

  private async chargeLineValidityCheck(id: string): Promise<void> {
    const currentChargeLine = await this.findChargeLineById(id);

    if (!currentChargeLine) {
      throw new BusinessError(
        ErrorType.NotFound,
        `Charge line ${id} does not exist`,
      );
    }

    if (!currentChargeLine.additionalCharge) {
      throw new BusinessError(
        ErrorType.Conflict,
        `Charge line ${id} is not an additional charge`,
      );
    }

    if (currentChargeLine.status != ChargeLineStatus.Pending) {
      throw new BusinessError(
        ErrorType.Conflict,
        `Charge line ${id} is not in a mutable state (requires pending status)`,
      );
    }
  }

  private async findChargeLineById(id: string) {
    return this.prisma.chargeLine.findUnique({
      where: { id },
    });
  }

  onModuleInit(): void {
    const instanceTypeConfiguration = this.configService.get('INSTANCE_TYPE');
    this.logger.log('InstanceType is ' + instanceTypeConfiguration);
    if (
      !instanceTypeConfiguration ||
      !Object.values(InstanceType).includes(instanceTypeConfiguration)
    ) {
      throw Error(
        'instance type not correctly set. Make sure it is set in the docker compose. Should be either shipper or forwarder. Currently:' +
          instanceTypeConfiguration,
      );
    }
    this.instanceType = instanceTypeConfiguration as InstanceType;
  }
}
