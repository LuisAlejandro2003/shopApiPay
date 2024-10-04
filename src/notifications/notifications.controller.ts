import { Controller, Post, Body, Get, Param, Delete, Patch, HttpCode, HttpStatus, NotFoundException, InternalServerErrorException, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // 201 Created
  async sendWhatsAppNotification(@Body() body: CreateNotificationDto) {
    try {
      const notification = await this.notificationsService.sendWhatsAppNotification(body);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'WhatsApp notification sent successfully',
        data: notification,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error sending WhatsApp notification: ${error.message}`,
      });
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK) // 200 OK
  async getAllNotifications(@Query() queryParams: any) {
    try {
      const notifications = await this.notificationsService.getAllNotifications(queryParams);
      return {
        statusCode: HttpStatus.OK,
        message: 'Notifications retrieved successfully',
        data: notifications.data,
        meta: notifications.meta,  // Meta información de paginación
      };
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving notifications: ${error.message}`,
      });
    }
  }
  

  @Get(':id')
  @HttpCode(HttpStatus.OK) // 200 OK
  async getNotificationById(@Param('id') id: string) {
    try {
      const notification = await this.notificationsService.getNotificationById(id);
      if (!notification) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Notification with ID ${id} not found`,
        });
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification retrieved successfully',
        data: notification,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Lanza el 404 correctamente
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving notification: ${error.message}`,
      });
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK) // 200 OK
  async updateNotification(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    try {
      const updatedNotification = await this.notificationsService.updateNotification(id, updateNotificationDto);
      if (!updatedNotification) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Notification with ID ${id} not found`,
        });
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Notification updated successfully',
        data: updatedNotification,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error updating notification: ${error.message}`,
      });
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content
  async deleteNotification(@Param('id') id: string) {
    try {
      const deleted = await this.notificationsService.deleteNotification(id);
      if (!deleted) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Notification with ID ${id} not found`,
        });
      }
      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Notification deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error deleting notification: ${error.message}`,
      });
    }
  }
}
