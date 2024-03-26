import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientKafka, ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './interfaces/user.schema';

const ENV = process.env.NODE_ENV;


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [ENV ? `.env.${ENV}` : '.env.production'],
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
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
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'user_producer',
      useFactory: (kafkaClient: ClientKafka) => kafkaClient,
      inject: ['user_producer_client'],
    },
  ],
  exports: [UsersService]
})
export class UsersModule { }