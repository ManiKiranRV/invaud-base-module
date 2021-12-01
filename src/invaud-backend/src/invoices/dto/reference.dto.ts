import { ReferenceView } from 'core';

export class ReferenceDto implements ReferenceView {
  id: string;
  qualifier: string;
  description: string;
  value: string;
  invoiceNumber: string;
}
