import { Body, Controller, Param } from '@nestjs/common';
import { Post } from '@nestjs/common'
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  async find(@Param('id') id: string) {
    // return this.authService.find(id);
  }

  @Post('login')
  async login(@Body() data: any): Promise<any> {
    return this.authService.login(data);
  }
}