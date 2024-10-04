import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
      throw new InternalServerErrorException(`WhatsApp notification failed: ${error.message}`);
    }
  }

  async getAllNotifications(queryParams: any): Promise<any> {
    const { page = 1, limit = 10, ...filters } = queryParams;  // Extracción de los parámetros de paginación y los filtros
    const skip = (page - 1) * limit;
  
    try {
      const [notifications, totalItems] = await Promise.all([
        this.notificationModel.find(filters).skip(skip).limit(Number(limit)).exec(),
        this.notificationModel.countDocuments(filters).exec(),
      ]);
  
      return {
        data: notifications,
        meta: {
          totalItems,
          itemCount: notifications.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(`Error retrieving notifications: ${error.message}`);
    }
  }
  
  async getNotificationById(id: string) {
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async updateNotification(id: string, updateNotificationDto: UpdateNotificationDto) {
    const updatedNotification = await this.notificationModel.findByIdAndUpdate(id, updateNotificationDto, { new: true }).exec();
    if (!updatedNotification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return updatedNotification;
  }

  async deleteNotification(id: string) {
    const deletedNotification = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!deletedNotification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return deletedNotification;
  }
}
