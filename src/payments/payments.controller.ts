import { Controller, Post, Body, Param, Get, Patch, Delete, Query, HttpCode, HttpStatus, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // 201 Created
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.paymentsService.create(createPaymentDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Payment created successfully',
        data: payment,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error creating payment: ${error.message}`,
      });
    }
  }

  @Post('capture/:orderId')
  @HttpCode(HttpStatus.OK) // 200 OK
  async capturePayment(@Param('orderId') orderId: string) {
    try {
      const captured = await this.paymentsService.capturePayment(orderId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Payment captured successfully',
        data: captured,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error capturing payment: ${error.message}`,
      });
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK) // 200 OK
  async findAllPayments(@Query() queryParams: any) {
    try {
      const payments = await this.paymentsService.findAll(queryParams);
      return {
        statusCode: HttpStatus.OK,
        message: 'Payments retrieved successfully',
        data: payments,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving payments: ${error.message}`,
      });
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK) // 200 OK
  async findPaymentById(@Param('id') id: string) {
    try {
      const payment = await this.paymentsService.findById(id);
      if (!payment) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Payment with ID ${id} not found`,
        });
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Payment retrieved successfully',
        data: payment,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Lanza el 404 correctamente
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving payment: ${error.message}`,
      });
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK) // 200 OK
  async updatePayment(@Param('id') id: string, @Body() updateData: any) {
    try {
      const updatedPayment = await this.paymentsService.update(id, updateData);
      if (!updatedPayment) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Payment with ID ${id} not found`,
        });
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Payment updated successfully',
        data: updatedPayment,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error updating payment: ${error.message}`,
      });
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  async deletePayment(@Param('id') id: string) {
    try {
      const deleted = await this.paymentsService.delete(id);
      if (!deleted) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Payment with ID ${id} not found`,
        });
      }
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Payment deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error deleting payment: ${error.message}`,
      });
    }
  }
}
