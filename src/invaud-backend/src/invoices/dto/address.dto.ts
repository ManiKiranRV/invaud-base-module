import { AddressType, AddressView } from 'core';

export class AddressDto implements AddressView {
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
