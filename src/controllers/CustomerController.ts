import { Request, Response, NextFunction } from 'express';
import { validate, Validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
  CreateCustomerInputs,
  CustomerLoginInput,
  EditCustomerInput,
} from '../dto';
import { Customer } from '../models';
import {
  createJWT,
  hashPassword,
  onRequestOtp,
  Salt,
  SendOtp,
  comparePassword,
} from '../utils';

export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body);

  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, password, phone } = customerInputs;

  const existCustomer = await Customer.findOne({ email });

  if (existCustomer) {
    return res.status(400).json({
      message: 'Email Already Exists',
    });
  }

  const salt = await Salt();
  const hashedPassword = await hashPassword(password, salt);

  const { otp, expiry } = SendOtp();

  const result = await Customer.create({
    email,
    password: hashedPassword,
    phone,
    salt,
    otp,
    otp_expiry: expiry,
    verified: false,
    firstName: '',
    lastName: '',
    address: '',
    lat: 0,
    lng: 0,
  });

  if (result) {
    // send the otp to the customer
    await onRequestOtp(otp, phone);

    // create token
    const token = createJWT({
      _id: result.id,
      email,
      verified: result.verified,
    });

    // send result to client
    return res
      .status(201)
      .json({ token: token, verified: result.verified, email: result.email });
  }

  return res.status(500).json({ message: 'Something went wrong' });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(CustomerLoginInput, req.body);
  const inputErrors = await validate(loginInputs, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, password } = loginInputs;

  const existCustomer = await Customer.findOne({ email });

  if (existCustomer) {
    const isMatch = await comparePassword(password, existCustomer.password);

    if (isMatch) {
      const token = createJWT({
        _id: existCustomer.id,
        email: existCustomer.email,
        verified: existCustomer.verified,
      });
      return res.status(200).json({ token, verified: existCustomer.verified });
    }
  }

  return res.status(400).json({ message: 'Invalid email or password' });
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findOne({ _id: customer._id });
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;
        const result = await profile.save();
        const token = createJWT({
          _id: result.id,
          email: result.email,
          verified: result.verified,
        });
        if (result) {
          return res
            .status(201)
            .json({ token, verified: result.verified, email: result.email });
        }
      }
    }
  }

  return res.status(500).json({ message: 'Something went wrong' });
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findOne({ _id: customer._id });
    if (profile) {
      const { otp, expiry } = SendOtp();
      profile.otp = otp;
      profile.otp_expiry = expiry;
      const result = await profile.save();
      if (result) {
        await onRequestOtp(otp, profile.phone);
        return res.status(200).json({ message: 'Otp sent successfully' });
      }
    }
  }

  return res.status(500).json({ message: 'Something went wrong' });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findOne(
      { _id: customer._id },
      {
        password: 0,
        salt: 0,
        otp: 0,
        otp_expiry: 0,
        phone: 0,
      }
    );
    if (profile) {
      return res.status(200).json(profile);
    }
  }
};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  const profileInputs = plainToClass(EditCustomerInput, req.body);

  const inputErrors = await validate(profileInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { firstName, lastName, address } = profileInputs;

  if (customer) {
    const profile = await Customer.findOne({ _id: customer._id });
    if (profile) {
      profile.firstName = profileInputs.firstName;
      profile.lastName = profileInputs.lastName;
      profile.address = profileInputs.address;
      const result = await profile.save();
      if (result) {
        return res
          .status(200)
          .json({ message: 'Profile updated successfully' });
      }
    }
  }

  return res.status(500).json({ message: 'Something went wrong' });
};
