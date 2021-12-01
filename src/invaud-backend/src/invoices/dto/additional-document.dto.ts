import { AdditionalDocumentView } from 'core';

export class AdditionalDocumentDto implements AdditionalDocumentView {
  id: string;
  name: string;
  format: string;
  createdBy: string;
  createdDate: string;
  invoiceNumber: string;
}
