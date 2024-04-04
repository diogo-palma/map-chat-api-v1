import { Body, Controller, HttpException, HttpStatus, Inject, OnModuleInit, Post, UseGuards } from '@nestjs/common';
import { MobileService } from './mobile.service';
import { ClientKafka } from '@nestjs/microservices';
import { Distance } from './distance/interfaces/distance.interface';
import { Observable, catchError } from 'rxjs';
import { AuthGuardAccount } from 'src/auth/auth.account.middleware';

@Controller('mobile')
export class MobileController implements OnModuleInit {
  constructor(
    private readonly mobileService: MobileService,
    @Inject('mobile-account_producer') private readonly client: ClientKafka,
  ) { }

  async onModuleInit() {
    const requestPatters = [
      'createOrUpdateDistance',
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

}
