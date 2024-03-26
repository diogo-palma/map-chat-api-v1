import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) { }

  async findOne(query: any): Promise<User> {
    try {
      const user = await this.userModel.findOne(query)

      if (user) {
        const userWithId = user.toObject();
        userWithId.id = userWithId._id.toString();
        delete userWithId._id;

        return userWithId;
      }

      throw new HttpException(`User not find`, HttpStatus.NOT_FOUND);
    } catch (error) {
      throw new HttpException(`Error while fetching user: ${error.message}`, HttpStatus.FORBIDDEN);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

}


