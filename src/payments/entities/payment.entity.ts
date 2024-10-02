import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Payment extends Document {
  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  status: string;

  @Prop()
  externalReference: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
