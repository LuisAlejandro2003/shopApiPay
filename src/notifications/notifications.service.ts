import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './entities/notification.entity';
import * as Twilio from 'twilio';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  private client: Twilio.Twilio;

  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.client = Twilio(accountSid, authToken);
  }

 
  async sendWhatsAppNotification(details: CreateNotificationDto) {
    try {
      const response = await this.client.messages.create({
        body: details.message,
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${details.phoneNumber}`,
      });

      const newNotification = new this.notificationModel({
        phoneNumber: details.phoneNumber,
        message: details.message,
        status: 'Sent',
        sid: response.sid,
        dateSent: response.dateCreated,
      });

      return await newNotification.save();
    } catch (error) {
      const failedNotification = new this.notificationModel({
        phoneNumber: details.phoneNumber,
        message: details.message,
        status: 'Failed',
        error: error.message,
      });

      await failedNotification.save();
      throw new Error(`WhatsApp notification failed: ${error.message}`);
    }
  }

  // Obtener todas las notificaciones
  async getAllNotifications() {
    return await this.notificationModel.find().exec();
  }

  // Obtener una notificación por ID
  async getNotificationById(id: string) {
    return await this.notificationModel.findById(id).exec();
  }

  // Actualizar una notificación
  async updateNotification(id: string, updateNotificationDto: UpdateNotificationDto) {
    return await this.notificationModel.findByIdAndUpdate(id, updateNotificationDto, { new: true }).exec();
  }

  // Eliminar una notificación
  async deleteNotification(id: string) {
    return await this.notificationModel.findByIdAndDelete(id).exec();
  }
}
