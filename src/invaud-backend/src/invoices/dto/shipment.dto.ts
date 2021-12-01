import { ShipmentView } from 'core';
import { StationDto } from './station.dto';

export class ShipmentDto implements ShipmentView {
  shipReferenceId: string;
  trackingNumber: string;
  invoiceNumber: string;
  modeOfTransport: string;
  shipmentDate: Date;
  stations: StationDto[];
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
