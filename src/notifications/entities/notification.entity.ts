import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop()
  phoneNumber: string;

  @Prop()
  message: string;

  @Prop()
  status: string;

  @Prop()
  sid?: string;  // Para almacenar el SID de Twilio en caso de éxito

  @Prop()
  dateSent?: Date;  // Fecha de envío en caso de éxito

  @Prop()
  error?: string;  // Mensaje de error en caso de fallo
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
