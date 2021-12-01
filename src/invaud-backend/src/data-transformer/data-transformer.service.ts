import { Injectable } from '@nestjs/common';
import {
  Address,
  AddressType,
  ChargeLineStatus,
  InvoiceStatus,
  ShipmentEvent,
  StationType,
} from 'core';
import { v4 as uuidv4 } from 'uuid';
import { AddressDto } from '../invoices/dto/address.dto';
import { ChainEventDto } from '../invoices/dto/chain-event.dto';
import { ChargeLineDto } from '../invoices/dto/charge-line.dto';
import { CreateInvoiceOverviewDto } from '../invoices/dto/create-invoice-overview.dto';
import { InvoiceDto } from '../invoices/dto/invoice.dto';
import { ReferenceDto } from '../invoices/dto/reference.dto';
import { ShipmentDto } from '../invoices/dto/shipment.dto';
import { StationDto } from '../invoices/dto/station.dto';
import { RulesEngineInputDto } from '../rules-engine/dto/rules-engine-input.dto';
import { RulesEngineOutputDto } from '../rules-engine/dto/rules-engine-output.dto';

@Injectable()
export class DataTransformerService {
  shipmentAndRulesEngineOutputToInvoiceDto(
    invoiceNumber: string,
    rulesEngineOutput: RulesEngineOutputDto,
    shipmentEvent: ShipmentEvent,
  ): InvoiceDto {
    const s = shipmentEvent.shipment;
    const shipReferenceid = s.shipReferenceId + uuidv4().slice(0, 4);

    const chargeLines = this.createChargeLines(
      invoiceNumber,
      rulesEngineOutput,
    );

    const stations: StationDto[] = [
      {
        id: uuidv4(),
        type: StationType.origin,
        code: s.originStation.code,
        name: s.originStation.code,
        country: s.originStation.country,
        shipReferenceId: shipReferenceid,
      },
      {
        id: uuidv4(),
        type: StationType.destination,
        code: s.destinationStation.code,
        name: s.destinationStation.code,
        country: s.destinationStation.country,
        shipReferenceId: shipReferenceid,
      },
    ];

    const shipment: ShipmentDto = {
      shipReferenceId: shipReferenceid,
      trackingNumber: s.trackingNo,
      invoiceNumber: invoiceNumber,
      modeOfTransport: s.modeOfTransport,
      shipmentDate: new Date(s.eta.dateTime),
      stations: stations,
      numberOfPieces: s.numberOfPieces,
      weight: +s.weight,
      weightUom: s.weightUom,
      chargeableWeight: +s.chargeableWeight,
      chargeableWeightUom: s.chargeableWeightUom,
      volume: +s.volume,
      volumeUom: s.volumeUom,
      freightTerms: s.freightTerms,
      otherChargesTerms: s.otherChargesTerms,
      shipmentIncoTerms: s.shipmentServiceCode,
      shipmentServiceCode: s.shipmentServiceCode,
      valueOfGoods: +s.valueOfGoods,
      goodsValuta: s.goodsValuta,
    };

    const chainEvents: ChainEventDto[] = shipmentEvent.events.map((event) => {
      return {
        id: uuidv4(),
        type: event.eventCode,
        time: new Date(event.dateTime),
        description: event.description,
        invoiceNumber: invoiceNumber,
      };
    });

    const references: ReferenceDto[] = shipmentEvent.references.map(
      (reference) => {
        return {
          id: uuidv4(),
          qualifier: reference.qualifier,
          description: reference.description,
          value: reference.value,
          invoiceNumber: invoiceNumber,
        };
      },
    );

    const invoiceDto: InvoiceDto = {
      invoiceNumber: invoiceNumber,
      status: InvoiceStatus.Proforma,
      selfBilled: false,
      invoiceDate: new Date(),
      invoiceCurrency: rulesEngineOutput.invoiceCurrency,
      locked: false,
      lockedBy: null,
      shipReferenceId: shipReferenceid,
      shipment: shipment,
      shipperAddress: this.mapAddress(
        shipmentEvent.addresses[1],
        AddressType.shipper,
        invoiceNumber,
      ),
      consigneeAddress: this.mapAddress(
        shipmentEvent.addresses[0],
        AddressType.consignee,
        invoiceNumber,
      ),
      billToPartyAddress: this.mapAddress(
        shipmentEvent.addresses[2],
        AddressType.billToParty,
        invoiceNumber,
      ),
      chainEvents: chainEvents,
      references: references,
      chargeLines: chargeLines,
      additionalDocuments: [],
    };

    return invoiceDto;
  }

  invoiceDtoToCreateInvoiceOverviewDto(
    invoice: InvoiceDto,
  ): CreateInvoiceOverviewDto {
    const originStation = invoice.shipment?.stations.find((station) => {
      return station.type === StationType.origin;
    });
    const destinationStation = invoice.shipment?.stations.find((station) => {
      return station.type === StationType.destination;
    });
    if (!(originStation && destinationStation)) {
      throw Error(
        'Could not transformInvoiceDtoToCreateInvoiceOverviewDto because the invoice has no originStation or destinationStation',
      );
    }
    return {
      invoiceNumber: invoice.invoiceNumber,
      status: InvoiceStatus.Proforma,
      originCode: originStation.code,
      destinationCode: destinationStation.code,
      shipmentDate: invoice.shipment.shipmentDate,
      invoiceDate: invoice.invoiceDate,
      billToParty: invoice.billToPartyAddress.name,
      shipper: invoice.shipperAddress.name,
      consignee: invoice.consigneeAddress.name,
      totalValueOfGoods: invoice.shipment.valueOfGoods,
    };
  }

  // Currently mocked until Rules Engine has been implemented
  transformShipmentDataToRulesEngineInputDto(
    shipmentData: ShipmentEvent,
  ): RulesEngineInputDto {
    return {
      id: 'string',
      customerId: 'string',
      originCountry: 'string',
      destinationCountry: shipmentData.masters.master.destination.country,
      modeOfTransport: 'string',
      incoTerms: 'string',
      serviceTypes: 'string',
      weight: 1,
      weightUom: 'string',
      volume: 1,
      volumeUom: 'string',
    };
  }

  createChargeLines(
    invoiceNumber: string,
    rulesEngineOutput: RulesEngineOutputDto,
  ): ChargeLineDto[] {
    const chargeLinesToCreate: ChargeLineDto[] =
      rulesEngineOutput.chargeLines.map((line) => {
        return {
          id: uuidv4(),
          code: line.chargeCode,
          description: line.chargeDescription,
          amount: line.chargeAmount,
          currency: rulesEngineOutput.invoiceCurrency,
          additionalCharge: line.additionalCharge,
          status: line.additionalCharge ? ChargeLineStatus.Pending : null,
          invoiceNumber: invoiceNumber,
        };
      });
    return chargeLinesToCreate;
  }

  private mapAddress(
    shipmentAddress: Address,
    addressType: AddressType,
    invoiceNumber: string,
  ): AddressDto {
    return {
      id: uuidv4(),
      type: addressType,
      name: shipmentAddress.name,
      addressLine1: shipmentAddress.line[0],
      addressLine2: shipmentAddress.line[1],
      city: shipmentAddress.city,
      zip: shipmentAddress.zip,
      country: shipmentAddress.country,
      countryName: shipmentAddress.countryName,
      taxId: shipmentAddress.taxId ?? null,
      shipperInvoiceNumber:
        addressType === AddressType.shipper ? invoiceNumber : null,
      consigneeInvoiceNumber:
        addressType === AddressType.consignee ? invoiceNumber : null,
      billToPartyInvoiceNumber:
        addressType === AddressType.billToParty ? invoiceNumber : null,
    };
  }
}
