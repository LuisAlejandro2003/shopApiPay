import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  @Post()
  async sendWhatsAppNotification(@Body() body: CreateNotificationDto) {
    return this.notificationsService.sendWhatsAppNotification(body);
  }

  @Get()
  async getAllNotifications() {
    return this.notificationsService.getAllNotifications();
  }


  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.notificationsService.getNotificationById(id);
  }


  @Patch(':id')
  async updateNotification(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.updateNotification(id, updateNotificationDto);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }
}
