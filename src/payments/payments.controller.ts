import { Controller, Post, Body, Param, Get, Patch, Delete, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Crear pago
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }
  

  // Capturar pago
  @Post('capture/:orderId')
  capturePayment(@Param('orderId') orderId: string) {
    return this.paymentsService.capturePayment(orderId);
  }

  // Obtener todos los pagos
  @Get()
  findAllPayments(@Query() queryParams: any) {
    return this.paymentsService.findAll(queryParams);
  }

  // Obtener pago por ID
  @Get(':id')
  findPaymentById(@Param('id') id: string) {
    return this.paymentsService.findById(id);
  }

  // Actualizar detalles de un pago   
  @Patch(':id')
  updatePayment(@Param('id') id: string, @Body() updateData: any) {
    return this.paymentsService.update(id, updateData);
  }

  // Eliminar un pago por ID
  @Delete(':id')
  deletePayment(@Param('id') id: string) {
    return this.paymentsService.delete(id);
  }
}
