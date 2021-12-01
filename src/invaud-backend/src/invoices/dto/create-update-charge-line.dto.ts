import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateOrUpdateChargeLineView } from 'core';

export class CreateOrUpdateChargeLineDto
  implements CreateOrUpdateChargeLineView
{
  @IsNotEmpty()
  @IsString()
  code: string;
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  @IsNotEmpty()
  @IsString()
  currency: string;
}
