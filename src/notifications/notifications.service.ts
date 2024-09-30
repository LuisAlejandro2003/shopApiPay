import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './entities/notification.entity';
import * as Twilio from 'twilio';

@Injectable()
export class NotificationsService {
  private client: Twilio.Twilio;

  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID; // Tu SID de cuenta de Twilio
    const authToken = process.env.TWILIO_AUTH_TOKEN; // Tu token de autenticación de Twilio
    this.client = Twilio(accountSid, authToken);
  }

  async sendWhatsAppNotification(details: { message: string; phoneNumber: string }) {
    try {
      // Enviar mensaje a través de Twilio
      const response = await this.client.messages.create({
        body: details.message,  
        from: process.env.TWILIO_WHATSAPP_FROM,  
        to: `whatsapp:${details.phoneNumber}`,  
      });

      // Guardar notificación en la base de datos
      const newNotification = new this.notificationModel({
        phoneNumber: details.phoneNumber,
        message: details.message,
        status: 'Sent',
        sid: response.sid,  // Almacenar el SID de Twilio
        dateSent: response.dateCreated,  // Fecha de creación del mensaje
      });

      return await newNotification.save();
    } catch (error) {
      // Guardar notificación fallida en la base de datos
      const failedNotification = new this.notificationModel({
        phoneNumber: details.phoneNumber,
        message: details.message,
        status: 'Failed',
        error: error.message,  // Guardar el mensaje de error
      });

      await failedNotification.save();
      throw new Error(`WhatsApp notification failed: ${error.message}`);
    }
  }
}
