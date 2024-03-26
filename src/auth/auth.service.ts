import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';


@Injectable()
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService
  ) { }

  async find(userId: string): Promise<User | null> {
    return this.userService.findOne(userId);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      if (user.status == "INACTIVATE") {
        throw new Error('User inactivate');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return user
      }
    }

    return null;
  }

  async login(data: any): Promise<any> {
    try {
      const { email, password } = data;
      const user = await this.validateUser(email, password);

      if (user) {
        const payload = { sub: user.id, userName: user.name, userEmail: user.email, roles: user.roles };
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          access_token: this.jwtService.sign(payload),
        };
      }
      throw new HttpException('Erro ao fazer o login', HttpStatus.FORBIDDEN);


    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }
}