import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verify, Secret } from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('Authorization not found in headers');
    }

    try {
      const decoded = verify(token, 'sua-chave-secreta' as Secret);

      const user = await this.userService.findOne({ _id: decoded.sub.toString() });

      if (!user) {
        throw new UnauthorizedException('Permission denied');
      }

      request.user = decoded;
      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Token invalid');
    }
  }
}