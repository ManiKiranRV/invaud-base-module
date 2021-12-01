
export interface RulesEngineOutputDto {
  id: string;
  laneId: string;
  laneName: string;
  mode: string;
  incoTerms: string;
  originCountry: string;
  destinationCountry: string;
  invoiceCurrency: string;
  chargeLines: ChargeLineDto[];
}

export interface ChargeLineDto {
  chargeCode: string;
  additionalCharge: boolean;
  chargeDescription: string;
  chargeAmount: number;
}

