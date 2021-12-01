import { InvoiceStatus, InvoiceView } from 'core';
import { AdditionalDocumentDto } from './additional-document.dto';
import { AddressDto } from './address.dto';
import { ChainEventDto } from './chain-event.dto';
import { ChargeLineDto } from './charge-line.dto';
import { ReferenceDto } from './reference.dto';
import { ShipmentDto } from './shipment.dto';

export class InvoiceDto implements InvoiceView {
  invoiceNumber: string;
  status: InvoiceStatus;
  selfBilled: boolean;
  invoiceDate: Date;
  invoiceCurrency: string | null;
  locked: boolean;
  lockedBy: string | null;
  shipReferenceId: string;
  shipment: ShipmentDto;
  shipperAddress: AddressDto;
  consigneeAddress: AddressDto;
  billToPartyAddress: AddressDto;
  chainEvents: ChainEventDto[];
  references: ReferenceDto[];
  chargeLines: ChargeLineDto[];
  additionalDocuments: AdditionalDocumentDto[];
}
