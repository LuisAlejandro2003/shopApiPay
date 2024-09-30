import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async sendWhatsAppNotification(@Body() body: { message: string; phoneNumber: string }) {
    return this.notificationsService.sendWhatsAppNotification(body);
  }
}
