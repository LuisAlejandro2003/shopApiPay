import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private paypalClient: paypal.core.PayPalHttpClient;

  constructor(@InjectModel(Payment.name) private paymentModel: Model<Payment>) {
    const environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET,
    );
    this.paypalClient = new paypal.core.PayPalHttpClient(environment);
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<any> {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: (createPaymentDto.price * createPaymentDto.quantity).toFixed(2), // Total del pago
        },
      }],
      application_context: {
        return_url: createPaymentDto.successUrl,  // URL de éxito
        cancel_url: createPaymentDto.failureUrl,  // URL de cancelación
      },
    });

    try {
      const order = await this.paypalClient.execute(request);
      const newPayment = new this.paymentModel({
        title: createPaymentDto.title,
        quantity: createPaymentDto.quantity,
        price: createPaymentDto.price,
        status: 'Pending',
        externalReference: order.result.id,
      });
      await newPayment.save();

      return order.result;
    } catch (error) {
      throw new InternalServerErrorException(`Error al crear el pago: ${error.message}`);
    }
  }

  async capturePayment(orderId: string): Promise<any> {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
      const capture = await this.paypalClient.execute(request);
      return capture.result;
    } catch (error) {
      throw new InternalServerErrorException(`Error al capturar el pago: ${error.message}`);
    }
  }

  async findAll(queryParams: any): Promise<any> {
    try {
      return await this.paymentModel.find(queryParams).exec();
    } catch (error) {
      throw new InternalServerErrorException(`Error al recuperar los pagos: ${error.message}`);
    }
  }

  async findById(id: string): Promise<any> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(id: string, updateData: any): Promise<any> {
    const updatedPayment = await this.paymentModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedPayment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return updatedPayment;
  }

  async delete(id: string): Promise<any> {
    const deletedPayment = await this.paymentModel.findByIdAndDelete(id).exec();
    if (!deletedPayment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return deletedPayment;
  }
}
