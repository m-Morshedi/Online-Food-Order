import { IsEmail, IsEmpty, Length } from 'class-validator';

export class CreateCustomerInputs {
  @IsEmail()
  email: string;

  @Length(5, 20)
  password: string;

  @Length(10, 11)
  phone: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class CustomerLoginInput {
  @IsEmail()
  email: string;

  @Length(5, 20)
  password: string;
}

export class EditCustomerInput {
  @Length(5, 20)
  firstName: string;

  @Length(5, 20)
  lastName: string;

  @Length(10, 11)
  address: string;
}
