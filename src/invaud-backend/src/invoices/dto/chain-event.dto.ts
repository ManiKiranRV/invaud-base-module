import { ChainEventView } from 'core';

export class ChainEventDto implements ChainEventView {
  id: string;
  type: string;
  time: Date;
  description: string;
  invoiceNumber: string;
}
