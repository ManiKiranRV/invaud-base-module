import {
  AddressType,
  ChargeLineStatus,
  InvoiceStatus,
  StationType,
} from './enums.prisma';

export interface Paginated<t> {
  data: t[];
  numberOfRecords: number;
}

export interface InvoiceOverview {
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

export interface InvoiceView {
  invoiceNumber: string;
  status: InvoiceStatus;
  selfBilled: boolean;
  invoiceDate: Date;
  invoiceCurrency: string | null;
  locked: boolean;
  lockedBy: string | null;
  shipReferenceId: string;
  shipment: ShipmentView;
  shipperAddress: AddressView;
  consigneeAddress: AddressView;
  billToPartyAddress: AddressView;
  chainEvents: ChainEventView[];
  references: ReferenceView[];
  chargeLines: ChargeLineView[];
  additionalDocuments: AdditionalDocumentView[];
}

export interface AddressView {
  id: string;
  type: AddressType;
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zip: string;
  country: string;
  countryName: string;
  taxId: string | null;
  shipperInvoiceNumber: string | null;
  consigneeInvoiceNumber: string | null;
  billToPartyInvoiceNumber: string | null;
}

export interface ChargeLineView {
  id: string;
  code: string;
  description: string;
  amount: number;
  currency: string;
  additionalCharge: boolean;
  status: ChargeLineStatus | null;
  invoiceNumber: string;
}

export interface ChainEventView {
  id: string;
  type: string;
  time: Date;
  description: string;
  invoiceNumber: string;
}

export interface ReferenceView {
  id: string;
  qualifier: string;
  description: string;
  value: string;
  invoiceNumber: string;
}

export interface AdditionalDocumentView {
  id: string;
  name: string;
  format: string;
  createdBy: string;
  createdDate: string;
  invoiceNumber: string;
}

export interface ShipmentView {
  shipReferenceId: string;
  trackingNumber: string;
  invoiceNumber: string;
  modeOfTransport: string;
  shipmentDate: Date;
  stations: StationView[];
  numberOfPieces: string;
  weight: number;
  weightUom: string;
  chargeableWeight: number;
  chargeableWeightUom: string;
  volume: number;
  volumeUom: string;
  freightTerms: string;
  otherChargesTerms: string;
  shipmentIncoTerms: string;
  shipmentServiceCode: string;
  valueOfGoods: number;
  goodsValuta: string;
}

export interface StationView {
  id: string;
  type: StationType;
  code: string;
  name: string;
  country: string;
  shipReferenceId: string;
}

export interface CreateOrUpdateChargeLineView {
  code: string;
  description: string;
  amount: number;
  currency: string;
}
