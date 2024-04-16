import { Body, Controller, Get, HttpException, HttpStatus, Inject, OnModuleInit, Param, Post, UseGuards } from '@nestjs/common';
import { MobileService } from './mobile.service';
import { ClientKafka } from '@nestjs/microservices';
import { Distance } from './distance/interfaces/distance.interface';
import { Observable, catchError } from 'rxjs';
import { AuthGuardAccount } from 'src/auth/auth.account.middleware';
import { Chat } from './chat/chat.interface';

@Controller('mobile')
export class MobileController implements OnModuleInit {
  constructor(
    private readonly mobileService: MobileService,
    @Inject('mobile-account_producer') private readonly client: ClientKafka,
  ) { }

  async onModuleInit() {
    const requestPatters = [
      'createOrUpdateDistance',
      'findNearestCoordinates',
      'createChat',
      'getChatsByAccountId',
      'getRecentMessages',
      'getChatMessageByDistance'
    ]

    requestPatters.forEach(async pattern => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect()
    })
  }

  @Post('create-or-update-distance')
  @UseGuards(AuthGuardAccount)
  createOrUpdateDistance(@Body() distance: Distance): Observable<Distance> {
    return this.client.send('createOrUpdateDistance', distance).pipe(
      catchError((error) => {
        throw new HttpException(error.message, HttpStatus.AMBIGUOUS);
      })
    );
  }

  @Post('find-nearest-coordinates')
  @UseGuards(AuthGuardAccount)
  findNearestCoordinates(@Body() data: { accountId: string, latitude: number, longitude: number }): Observable<{ latitude: number, longitude: number }[]> {
    return this.client.send('findNearestCoordinates', data).pipe(
      catchError((error) => {
        throw new HttpException(error.message, HttpStatus.AMBIGUOUS);
      })
    );
  }

  @Post('create-chat')
  @UseGuards(AuthGuardAccount)
  createChat(@Body() data: { accountIds: string[], message: string, fromIdMessage: string }): Observable<Chat> {
    return this.client.send('createChat', data).pipe(
      catchError((error) => {
        throw new HttpException(error.message, HttpStatus.AMBIGUOUS);
      })
    );
  }

  @Get('get-chat-by-account/:accountId')
  @UseGuards(AuthGuardAccount)
  getChatsByAccountId(@Param('accountId') accountId: string): Observable<Chat> {
    return this.client.send('getChatsByAccountId', accountId).pipe(
      catchError((error) => {
        throw new HttpException(error.message, HttpStatus.AMBIGUOUS);
      })
    );
  }

  @Get('get-chat-message/:chatId/:count')
  @UseGuards(AuthGuardAccount)
  getRecentMessages(@Param('chatId') chatId: string, @Param('count') count: string): Observable<Chat> {
    const data = {
      chatId,
      count
    }
    return this.client.send('getRecentMessages', data).pipe(
      catchError((error) => {
        throw new HttpException(error.message, HttpStatus.AMBIGUOUS);
      })
    );
  }

  @Get('get-chat-by-distance/:accountId/:toAccountId/:count')
  @UseGuards(AuthGuardAccount)
  getChatMessageByDistance(@Param('accountId') accountId: string, @Param('toAccountId') toAccountId: string, @Param('count') count: string): Observable<Chat> {
    const data = {
      accountId,
      toAccountId,
      count
    }
    return this.client.send('getChatMessageByDistance', data).pipe(
      catchError((error) => {
        throw new HttpException(error.message, HttpStatus.AMBIGUOUS);
      })
    );
  }
}
