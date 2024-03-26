import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { ConfigModule } from '@nestjs/config';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from './interfaces/account.schema';
import { AccountsService } from './account.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [ENV ? `.env.${ENV}` : '.env.production'],
    }),
    MongooseModule.forFeature([
      { name: 'Account', schema: AccountSchema },
    ]),
    ClientsModule.register([
      {
        name: 'user_producer_client',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user_producer',
            brokers: [process.env.KAFKA_URL],
          },
          consumer: {
            groupId: 'user-consumer',
            allowAutoTopicCreation: true
          }
        },
      },
    ]),
    UsersModule,
  ],
  controllers: [AccountController],
  providers: [
    AccountsService,
    {
      provide: 'user_producer',
      useFactory: (kafkaClient: ClientKafka) => kafkaClient,
      inject: ['user_producer_client'],
    },
  ],
  exports: [AccountsService]
})
export class AccountModule { }
