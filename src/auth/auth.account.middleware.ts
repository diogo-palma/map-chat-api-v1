import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verify, Secret } from 'jsonwebtoken';
import { AccountsService } from 'src/account/account.service';

@Injectable()
export class AuthGuardAccount implements CanActivate {
  constructor(
    private readonly accountService: AccountsService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('Authorization not found in headers');
    }

    try {
      const decoded = verify(token, 'sua-chave-secreta' as Secret);

      const account = this.accountService.findOne({ _id: decoded.sub.toString() });

      if (!account) {
        throw new UnauthorizedException('Permission denied');
      }

      request.account = decoded;
      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Token invalid');
    }
  }
}