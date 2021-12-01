import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Paginated } from 'core';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ErrorFilter } from '../errors/error.filter';
import { UserQueryRequestDto } from '../users/dto/userQueryRequest.dto';
import { ChargeLineDto } from './dto/charge-line.dto';
import { CreateOrUpdateChargeLineDto } from './dto/create-update-charge-line.dto';
import { CreateInvoiceOverviewDto } from './dto/create-invoice-overview.dto';
import { InvoiceOverviewDto } from './dto/invoice-overview.dto';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('Invoices')
@UseFilters(new ErrorFilter())
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('forwarder', 'shipper')
  @HttpCode(200)
  @Post('overview')
  async getInvoiceOverviews(
    @Body() query?: UserQueryRequestDto,
    @Query('skip') from?: string,
    @Query('take') to?: string,
  ): Promise<Paginated<InvoiceOverviewDto>> {
    const skip = from ? Number(from) : 0;
    const take = to ? Number(to) : 10;
    return this.invoicesService.getInvoiceOverviews({
      skip,
      take,
      orderBy: query?.sortParams,
      where: query?.searchParams,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('forwarder', 'shipper')
  @Get(':id')
  async getInvoiceById(@Param('id') id: string): Promise<InvoiceDto> {
    const invoice = await this.invoicesService.getInvoice(id);
    if (!invoice) throw new NotFoundException();
    return invoice;
  }

  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('forwarder', 'shipper')
  @HttpCode(200)
  @Post(':id/chargelineoverview')
  async getChargeLinesForInvoice(
    @Param('id') invoiceNumber: string,
    @Body() query?: UserQueryRequestDto,
    @Query('skip') from?: string,
    @Query('take') to?: string,
  ): Promise<Paginated<ChargeLineDto>> {
    const skip = from ? Number(from) : 0;
    const take = to ? Number(to) : 10;
    return this.invoicesService.getChargeLinesForInvoice(invoiceNumber, {
      skip,
      take,
      orderBy: query?.sortParams,
      where: query?.searchParams,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('forwarder')
  @Post(':id/chargeline')
  async addAdditionalChargeLineToInvoice(
    @Param('id') invoiceNumber: string,
    @Body() createChargeLineDto: CreateOrUpdateChargeLineDto,
  ): Promise<ChargeLineDto> {
    return this.invoicesService.addAdditionalChargeLineToInvoice(
      invoiceNumber,
      createChargeLineDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shipper')
  @Put('chargeline/:id/approve')
  async approveChargeLine(
    @Param('id') chargeLineId: string,
  ): Promise<ChargeLineDto> {
    return this.invoicesService.approveAdditionalCharge(chargeLineId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shipper')
  @Put('chargeline/:id/reject')
  async rejectChargeLine(
    @Param('id') chargeLineId: string,
  ): Promise<ChargeLineDto> {
    return this.invoicesService.rejectAdditionalCharge(chargeLineId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('forwarder')
  @Put('chargeline/:id/amend')
  async amendChargeLine(
    @Param('id') chargeLineId: string,
    @Body() updateChargeLineDto: CreateOrUpdateChargeLineDto,
  ): Promise<ChargeLineDto> {
    return this.invoicesService.amendAdditionalCharge(
      chargeLineId,
      updateChargeLineDto,
    );
  }

  // Only used during development
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shipper', 'forwarder', 'admin', 'super_admin')
  @Post('dev/overview-create')
  async createInvoiceOverview(
    @Body() createInvoiceOverviewDto: CreateInvoiceOverviewDto,
  ): Promise<InvoiceOverviewDto> {
    try {
      const createdInvoice = await this.invoicesService.createInvoiceOverview(
        createInvoiceOverviewDto,
      );
      return createdInvoice;
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shipper', 'forwarder', 'admin', 'super_admin')
  @Post('dev/invoice-create')
  async createInvoice(
    @Body() createInvoiceDto: InvoiceDto,
  ): Promise<InvoiceDto> {
    try {
      const createdInvoice = await this.invoicesService.createInvoice(
        createInvoiceDto,
      );
      return createdInvoice;
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
