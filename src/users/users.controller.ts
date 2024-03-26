import { Body, Controller, HttpException, HttpStatus, Inject, OnModuleInit, Post, Req, UseGuards } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { Observable, catchError, tap } from 'rxjs';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController implements OnModuleInit {

  constructor(
    @Inject('user_producer') private readonly usersService: ClientKafka,
  ) { }

  async onModuleInit() {
    const requestPatters = [
      'find-all-user',
      'create-user',
      'find-user',
      'update-user',
      'delete-user',
      'login-user',
      'new-token-user',
      'update-password-user'
    ]


    requestPatters.forEach(async pattern => {
      this.usersService.subscribeToResponseOf(pattern);
      await this.usersService.connect()
    })
  }

  @Post('')
  create(
    @Req() req: Request,
    @Body() user: UserDto
  ): Observable<User> {
    return this.usersService.send('create-user', user)

  }

}
