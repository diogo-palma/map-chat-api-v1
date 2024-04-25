import { Controller, Get, Post, Body, Patch, Param, Delete, Query, OnModuleInit, Inject, UseGuards, HttpException, HttpStatus, Req } from '@nestjs/common';
import { Notification } from './interfaces/notification.interface';
import { Observable } from 'rxjs';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/auth.middleware';
import { AuthGuardAccount } from 'src/auth/auth.account.middleware';
import { NotificationGateway } from './notification.gateway';

interface CustomRequest extends Request {
  account?: any;
  user?: any
}

@Controller('notification')
export class NotificationController implements OnModuleInit {
  constructor(
    @Inject('notification_producer') private readonly client: ClientKafka,
    private readonly notificationGateway: NotificationGateway,
  ) { }

  async onModuleInit() {
    const requestPatters = [
      'find-all-notification',
      'update-notification',
      'count-notification-admin',
      'count-notification-front'
    ]


    requestPatters.forEach(async pattern => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect()
    })
  }


  @Get()
  @UseGuards(AuthGuardAccount)
  findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('search') search: string,
    @Query('orderByField') orderByField: string,
    @Query('orderDirection') orderDirection: string,
    @Query('filter') filter: number
  ): Observable<Notification[]> {
    const data = {
      page: page || 1,
      pageSize: pageSize || 10,
      search: search || null,
      orderByField,
      orderDirection,
      filter
    };

    return this.client.send('find-all-notification', data);
  }

  @Get('front')
  @UseGuards(AuthGuardAccount)
  findAllFront(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('search') search: string,
    @Query('orderByField') orderByField: string,
    @Query('orderDirection') orderDirection: string,
    @Query('filter') filter: number
  ): Observable<Notification[]> {
    const accountData = req as CustomRequest || null;
    if (!accountData.account) {
      throw new HttpException('Sem autorização', HttpStatus.BAD_REQUEST);
    }

    let filterData = {
      isAdmin: false,
      accountId: accountData.account.sub.toString()
    }

    const data = {
      page: page || 1,
      pageSize: pageSize || 10,
      search: search || null,
      orderByField,
      orderDirection,
      filter: filterData
    };

    return this.client.send('find-all-notification', data);
  }

  @Post('test-notification')
  async testNotification(@Body() body: any) {
    console.log("oi", body)
    this.notificationGateway.server.emit('notification', body)
  }


  @Post('update-notifications')
  @UseGuards(AuthGuardAccount)
  async updateNotifications(@Body() body: any): Promise<void> {
    try {

      this.client.emit('update-notification', body);

    } catch (error) {
      throw new RpcException(`Error while updating notifications: ${error.message}`);
    }
  }

  @Post('update-notifications-front')
  @UseGuards(AuthGuardAccount)
  async updateNotificationsFront(@Body() body: any): Promise<void> {
    try {

      this.client.emit('update-notification', body);

    } catch (error) {
      throw new RpcException(`Error while updating notifications: ${error.message}`);
    }
  }

  @Get('count-notification-admin')
  @UseGuards(AuthGuardAccount)
  countAdminNotifications(
  ): Observable<any> {
    try {
      return this.client.send('count-notification-admin', {});
    } catch (error) {
      throw new RpcException(`Error while updating notifications: ${error.message}`);
    }
  }

  @Get('count-notification-front')
  @UseGuards(AuthGuardAccount)
  countFrontNotifications(
    @Req() req: Request,
  ): Observable<any> {
    try {
      const accountData = req as CustomRequest || null;
      if (!accountData.account) {
        throw new HttpException('Sem autorização', HttpStatus.BAD_REQUEST);
      }
      return this.client.send('count-notification-front', { accountId: accountData.account.sub.toString() });
    } catch (error) {
      throw new RpcException(`Error while updating notifications: ${error.message}`);
    }
  }

}