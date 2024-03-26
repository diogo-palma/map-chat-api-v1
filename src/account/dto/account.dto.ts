export class AccountDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  social_number: string;
  status?: 'ACTIVATE' | 'INACTIVATE';
  provider: string;
}