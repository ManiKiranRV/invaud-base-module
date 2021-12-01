import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { InvoiceStatus } from 'core';

export class CreateInvoiceOverviewDto {
  @IsNotEmpty()
  @IsString()
  invoiceNumber: string;

  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

  @IsNotEmpty()
  @IsString()
  originCode: string;

  @IsNotEmpty()
  @IsString()
  destinationCode: string;

  @IsNotEmpty()
  @IsDateString()
  shipmentDate: Date;

  @IsNotEmpty()
  @IsDateString()
  invoiceDate: Date;

  @IsNotEmpty()
  @IsString()
  billToParty: string;

  @IsNotEmpty()
  @IsString()
  shipper: string;

  @IsNotEmpty()
  @IsString()
  consignee: string;

  @IsNotEmpty()
  @IsNumber()
  totalValueOfGoods: number;
}
