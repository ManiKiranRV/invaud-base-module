import { Test, TestingModule } from '@nestjs/testing';
import { RulesEngineService } from './rules-engine.service';

describe('RulesEngineService', () => {
  let service: RulesEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RulesEngineService],
    }).compile();

    service = module.get<RulesEngineService>(RulesEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the rules engine output from the file rules.json', () => {
    expect(
      service.callRulesEngine({
        id: '1234567890',
        customerId: 'PAASC001',
        originCountry: 'CHINA',
        destinationCountry: 'JAPAN',
        modeOfTransport: 'AIR',
        incoTerms: 'DAT',
        serviceTypes: 'DOOR-TO-PORT',
        weight: 1120.6, // This is a string in the current example payload. Should be a number?
        weightUom: 'KGM',
        volume: 12.718,
        volumeUom: 'MTQ',
      }),
    ).toStrictEqual({
      id: '1234567890',
      laneId: 'L101',
      laneName: 'Trade Lane1 between CHINA and JAPAN',
      mode: 'AIR',
      incoTerms: 'DAT',
      originCountry: 'CHINA',
      destinationCountry: 'JAPAN',
      invoiceCurrency: 'USD',
      chargeLines: [
        {
          chargeCode: 'OTHF',
          additionalCharge: false,
          chargeDescription: 'Origin terminal handling-Forwarder',
          chargeAmount: 150.0,
          chargeCurrency: 'USD',
        },
        {
          chargeCode: 'OCLE',
          additionalCharge: false,
          chargeDescription: 'Export Customs Clearence',
          chargeAmount: 165.0,
          chargeCurrency: 'USD',
        },
        {
          chargeCode: 'OADM',
          additionalCharge: false,
          chargeDescription: 'Org. Administartive Handling',
          chargeAmount: 130.0,
          chargeCurrency: 'USD',
        },
        {
          chargeCode: 'OPUP',
          additionalCharge: false,
          chargeDescription: 'Pickup via truck',
          chargeAmount: 150.0,
          chargeCurrency: 'USD',
        },
        {
          chargeCode: 'FRT',
          additionalCharge: false,
          chargeDescription: 'Fuel Charge',
          chargeAmount: 650.0,
          chargeCurrency: 'USD',
        },
      ],
    });
  });
});
