import { Injectable, Logger } from '@nestjs/common';
import { ChargeLineDto } from '../../../invoices/dto/charge-line.dto';
import { InvoiceDto } from '../../../invoices/dto/invoice.dto';
import { InvoicesService } from '../../../invoices/invoices.service';

@Injectable()
export class ShipperConsumerService {
  constructor(private readonly invoicesService: InvoicesService) {}

  public async handleProformaCreatedEvent(
    decodedMessage: string,
  ): Promise<void> {
    const invoiceDto: InvoiceDto = JSON.parse(decodedMessage);

    await this.invoicesService.createInvoiceAndOverview(invoiceDto);
  }

  public async handleAdditionalChargeAddedEvent(
    decodedMessage: string,
  ): Promise<void> {
    const chargeLineDto: ChargeLineDto = JSON.parse(decodedMessage);

    await this.invoicesService.addAdditionalChargeLineToInvoice(
      chargeLineDto.invoiceNumber,
      chargeLineDto,
    );
  }

  public async handleAdditionalChargeUpdatedEvent(
    decodedMessage: string,
  ): Promise<void> {
    const chargeLineDto: ChargeLineDto = JSON.parse(decodedMessage);

    await this.invoicesService.amendAdditionalCharge(
      chargeLineDto.id,
      chargeLineDto,
    );
  }
}
