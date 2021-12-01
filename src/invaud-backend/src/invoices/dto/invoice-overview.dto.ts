import { InvoiceOverview, InvoiceStatus } from 'core';

export class InvoiceOverviewDto implements InvoiceOverview {
  invoiceNumber: string;
  status: InvoiceStatus;
  originCode: string;
  destinationCode: string;
  shipmentDate: Date;
  invoiceDate: Date;
  billToParty: string;
  shipper: string;
  consignee: string;
  totalValueOfGoods: number;
  locked: boolean;
  lockedBy: string | null;
}
