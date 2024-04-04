import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { MobileModule } from './mobile/mobile.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [ENV ? `.env.${ENV}` : '.env.production'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('MONGODB_URL')}:${configService.get('MONGODB_PORT')}/?authMechanism=DEFAULT`,
        user: `${configService.get('MOGODB_USER')}`,
        pass: `${configService.get('MOGODB_PASS')}`,
        dbName: 'map-chat',
      }),

      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    AccountModule,
    MobileModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
