import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config'; // Para manejar variables de entorno
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI), 
    ProductsModule,
    PaymentsModule,
    NotificationsModule,
  ],

})
export class AppModule {}
