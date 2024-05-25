import { Request, Response, NextFunction } from 'express';
import { CreateVendorInput } from '../dto';
import { Vendor } from '../models';
import { hashPassword, Salt } from '../utils';

export const FindVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email });
  } else {
    return await Vendor.findById(id);
  }
};

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    foodType,
    pinCode,
    address,
    phone,
    email,
    password,
  } = <CreateVendorInput>req.body;

  const existVendor = await FindVendor('', email);
  if (existVendor !== null) {
    res.status(400).send('Email Already Exists');
  }

  const GenSalt = await Salt();
  const hashedPassword = await hashPassword(password, GenSalt);

  const createVendor = await Vendor.create({
    name,
    ownerName,
    foodType,
    pinCode,
    address,
    phone,
    email,
    password: hashedPassword,
    salt: GenSalt,
    serviceAvailable: false,
    coverImages: [],
    rating: 0,
    foods: [],
  });

  return res.status(201).json(createVendor);
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find({});
  if (!vendors) {
    return res.status(404).send('No vendors found');
  }
  return res.json(vendors);
};

export const GetVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = await FindVendor(req.params.id);
  if (!vendor) {
    return res.status(404).send('No vendor found');
  }
  return res.json(vendor);
};
