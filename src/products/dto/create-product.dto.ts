import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsString()
  readonly category: string;

  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
