import { Module } from '@nestjs/common';
import { MobileService } from './mobile.service';
import { MobileController } from './mobile.controller';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { AccountModule } from 'src/account/account.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'mobile-account_producer_client',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'mobile-account_producer',
            brokers: [process.env.KAFKA_URL],
          },
          consumer: {
            groupId: 'mobile-account-consumer',
            allowAutoTopicCreation: true
          }
        },
      },
    ]),
    AccountModule,
    NotificationModule
  ],
  controllers: [MobileController],
  providers: [
    {
      provide: 'mobile-account_producer',
      useFactory: (kafkaClient: ClientKafka) => kafkaClient,
      inject: ['mobile-account_producer_client'],
    },
    MobileService,
  ],
})
export class MobileModule { }
