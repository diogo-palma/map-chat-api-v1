import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from './interfaces/account.interface';



@Injectable()
export class AccountsService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Account>
  ) { }

  async findOne(query: any): Promise<Account> {
    try {
      const account = await this.accountModel.findOne(query)

      if (account) {
        const accountWithId = account.toObject();
        accountWithId.id = accountWithId._id.toString();
        delete accountWithId._id;

        return accountWithId;
      }

      throw new HttpException(`Account not find`, HttpStatus.NOT_FOUND);
    } catch (error) {
      throw new HttpException(`Error while fetching account: ${error.message}`, HttpStatus.FORBIDDEN);
    }
  }

}