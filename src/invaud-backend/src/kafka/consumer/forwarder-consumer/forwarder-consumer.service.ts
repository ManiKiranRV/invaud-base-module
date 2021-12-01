import { Injectable } from '@nestjs/common';
import { ShipmentEvent } from 'core';
import { DataTransformerService } from '../../../data-transformer/data-transformer.service';
import { ChargeLineDto } from '../../../invoices/dto/charge-line.dto';
import { InvoicesService } from '../../../invoices/invoices.service';
import { RulesEngineService } from '../../../rules-engine/rules-engine.service';
import { ProducerService } from '../../producer/producer.service';

@Injectable()
export class ForwarderConsumerService {
  constructor(
    private kafkaProducerService: ProducerService,
    private readonly invoicesService: InvoicesService,
    private readonly transformer: DataTransformerService,
    private readonly rulesEngineService: RulesEngineService,
  ) {}

  public async handlePickupEvent(decodedMessage: string): Promise<void> {
    const shipmentEvent: ShipmentEvent = JSON.parse(decodedMessage);

    const rulesEngineOutput = await this.rulesEngineService.callRulesEngine(
      this.transformer.transformShipmentDataToRulesEngineInputDto(
        shipmentEvent,
      ),
    );

    const invoiceDto =
      this.transformer.shipmentAndRulesEngineOutputToInvoiceDto(
        this.invoicesService.generateInvoiceNumber(),
        rulesEngineOutput,
        shipmentEvent,
      );

    await this.invoicesService.createInvoiceAndOverview(invoiceDto);

    this.kafkaProducerService.produceProformaCreatedEvent(invoiceDto);
  }

  public async handleAdditionalChargeApprovedEvent(
    decodedMessage: string,
  ): Promise<void> {
    const chargeLineDto: ChargeLineDto = JSON.parse(decodedMessage);

    await this.invoicesService.approveAdditionalCharge(chargeLineDto.id);
  }

  public async handleAdditionalChargeRejectedEvent(
    decodedMessage: string,
  ): Promise<void> {
    const chargeLineDto: ChargeLineDto = JSON.parse(decodedMessage);

    await this.invoicesService.rejectAdditionalCharge(chargeLineDto.id);
  }
}
