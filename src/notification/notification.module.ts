import { NotificationController } from './notification.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationGateway } from './notification.gateway';
import { Module } from '@nestjs/common';
import { AuthGuardAccount } from 'src/auth/auth.account.middleware';
import { AccountModule } from 'src/account/account.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    NotificationGateway,
    ConfigModule.forRoot({
      envFilePath: [ENV ? `.env.${ENV}` : '.env.production'],
    }),
    ClientsModule.register([
      {
        name: 'notification_producer_client',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'notification_producer',
            brokers: [process.env.KAFKA_URL],
          },
          consumer: {
            groupId: 'notification-consumer',
            allowAutoTopicCreation: true
          }
        },
      },
    ]),
    AccountModule
  ],
  controllers: [NotificationController],
  providers: [
    {
      provide: 'notification_producer',
      useFactory: (kafkaClient: ClientKafka) => kafkaClient,
      inject: ['notification_producer_client'],
    },
    NotificationGateway
  ],
  exports: [NotificationGateway]
})
export class NotificationModule { }