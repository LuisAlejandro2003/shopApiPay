import { IsString, IsNumber, IsUrl, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;  // Título del producto o servicio

  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;  // Cantidad del producto o servicio

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;  // Precio unitario del producto o servicio

  @IsUrl()
  @IsNotEmpty()
  readonly successUrl: string;  // URL de retorno para pago exitoso

  @IsUrl()
  @IsNotEmpty()
  readonly failureUrl: string;  // URL de retorno para pago fallido

  @IsUrl()
  @IsNotEmpty()
  readonly pendingUrl: string;  // URL de retorno para pago pendiente
}
