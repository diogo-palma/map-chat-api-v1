import { Body, Controller, Get, HttpException, HttpStatus, Inject, OnModuleInit, Post, Query, UseGuards } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { AccountDto } from './dto/account.dto';
import { Observable, catchError } from 'rxjs';
import { Account } from './interfaces/account.interface';
import { AuthGuard } from 'src/auth/auth.middleware';


@Controller('account')
export class AccountController implements OnModuleInit {
  constructor(
    @Inject('user_producer') private readonly client: ClientKafka,
  ) { }

  async onModuleInit() {
    const requestPatters = [
      'find-all-account',
      'create-account',
      'find-account',
      'update-account',
      'delete-account',
      'login-account',
      'create-account-front',
      'update-account-front',
      'find-account-front',
      'new-token-account',
      'update-password-account'
    ]


    requestPatters.forEach(async pattern => {
      this.client.subscribeToResponseOf(pattern);
      await this.client.connect()
    })
  }

  @Post('login')
  login(@Body() user: AccountDto): Observable<Account> {
    return this.client.send('login-account', user).pipe(
      catchError((error) => {
        throw new HttpException(error.message, HttpStatus.AMBIGUOUS);
      })
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  index(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('search') search: string,
    @Query('orderByField') orderByField: string,
    @Query('orderDirection') orderDirection: string,
    @Query('filter') filter: number
  ): Observable<Account[]> {
    const data = {
      page: page || 1,
      pageSize: pageSize || 10,
      search: search || null,
      orderByField,
      orderDirection,
      filter
    };


    return this.client.send('find-all-account', data);
  }


}


