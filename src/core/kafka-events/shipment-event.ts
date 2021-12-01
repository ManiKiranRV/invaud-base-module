export interface ShipmentEvent {
  shipment: Shipment;
  masters: Masters;
  addresses: Address[];
  events: Event[];
  references: Reference[];
  remarks: Remark[];
  packages: Package[];
}

export interface Shipment {
  trackingNo: string;
  shipReferenceId: string;
  modeOfTransport: string;
  waybillCreation: Eta;
  etd: Eta;
  eta: Eta;
  originStation: DestinationStation;
  destinationStation: DestinationStation;
  numberOfPieces: string;
  weight: string;
  weightUom: string;
  chargeableWeight: string;
  chargeableWeightUom: string;
  volume: string;
  volumeUom: string;
  freightTerms: string;
  otherChargesTerms: string;
  shipmentIncoTerms: string;
  commodityCode: string;
  commodityText: string;
  shipmentServiceCode: string;
  shipmentTypeCode: string;
  podSignee: string;
  dangerousGoods: string;
  valueOfGoods: string;
  goodsValuta: string;
}

export interface Address {
  idSource: string;
  id: string;
  legacyIdOrigin: string;
  party: string;
  name: string;
  line: string[];
  city: string;
  state: string;
  zip: string;
  country: string;
  countryName: string;
  companyName: string;
  taxId: string;
}

export interface Event {
  eventCode: string;
  eventCodeLegacy: string;
  description: string;
  dateTime: string;
  dateTimeOffset: string;
  locationCode: string;
}

export interface Masters {
  master: Master;
}

export interface Master {
  trackingNo: string;
  mstReferenceId: string;
  waybillCreation: Eta;
  carrier: DestinationStation;
  transportNumber: string;
  origin: DestinationStation;
  destination: DestinationStation;
  modeOfTransport: string;
  events: Event[];
}

export interface DestinationStation {
  code: string;
  iatacode2l?: string;
  name: string;
  country: string;
}

export interface Eta {
  dateTime: string;
  dateTimeOffset: string;
}

export interface Package {
  packageCount: string;
  type: string;
  grossWeight: string;
  grossWeightUom: string;
  commodity: string;
  length: string;
  lengthUom: string;
  width: string;
  widthUom: string;
  height: string;
  heightUom: string;
  temperatureRange: TemperatureRange;
}

export interface TemperatureRange {
  requiredTemperatureMinimum: string;
  requiredTemperatureMaximum: string;
}

export interface Reference {
  qualifier: string;
  description: string;
  value: string;
}

export interface Remark {
  remarkType: string;
  text: string;
}
