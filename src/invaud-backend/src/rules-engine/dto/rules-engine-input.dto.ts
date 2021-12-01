
export interface RulesEngineInputDto {
  id: string;
  customerId: string;
  originCountry: string;
  destinationCountry: string;
  modeOfTransport: string;
  incoTerms: string;
  serviceTypes: string;
  weight: number;
  weightUom: string;
  volume: number;
  volumeUom: string;
}