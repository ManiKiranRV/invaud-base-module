import { ChargeLineStatus, ChargeLineView } from 'core';

export class ChargeLineDto implements ChargeLineView {
  id: string;
  code: string;
  description: string;
  amount: number;
  currency: string;
  additionalCharge: boolean;
  status: ChargeLineStatus | null;
  invoiceNumber: string;
}
