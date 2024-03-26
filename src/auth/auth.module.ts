import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'sua-chave-secreta',
      signOptions: { expiresIn: '120d' },
    }),
  ]
})
export class AuthModule { }
