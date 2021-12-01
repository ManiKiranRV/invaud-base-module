//TODO: move this to core. Properly type relevant fields
export interface ReconciliationOverview {
  invoiceNumber: string;
  level: string;
  invoiceDate: string;
  chargeCode: string;
  chargeDescription: string;
  chargeAmount: string;
  chargeCurrency: string;
  result: boolean;
}
