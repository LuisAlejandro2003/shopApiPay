import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Enviar una notificación por WhatsApp
  @Post()
  async sendWhatsAppNotification(@Body() body: CreateNotificationDto) {
    return this.notificationsService.sendWhatsAppNotification(body);
  }

  // Obtener todas las notificaciones
  @Get()
  async getAllNotifications() {
    return this.notificationsService.getAllNotifications();
  }

  // Obtener una notificación por ID
  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.notificationsService.getNotificationById(id);
  }

  // Actualizar una notificación
  @Patch(':id')
  async updateNotification(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.updateNotification(id, updateNotificationDto);
  }

  // Eliminar una notificación
  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }
}
