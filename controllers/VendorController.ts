import { Request, Response, NextFunction } from 'express';
import { EditVendorInput, VendorLoginInput, CreateFoodInput } from '../dto';
import { FindVendor } from './AdminController';
import { comparePassword, createJWT } from '../utils';
import { Food } from '../models';
import asyncWrapper from 'async-wrapper-express-ts';

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;
  const existVendor = await FindVendor('', email);
  if (!existVendor) {
    return res.status(400).json({
      message: 'Invalid email or password',
    });
  }

  const isMatch = await comparePassword(password, existVendor.password);
  if (!isMatch) {
    return res.status(400).json({
      message: 'Invalid email or password',
    });
  }
  const token = createJWT({
    _id: existVendor.id,
    email: existVendor.email,
    name: existVendor.name,
    foodType: existVendor.foodType,
  });
  res.json(token);
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existVendor = await FindVendor(user._id);
    return res.json(existVendor);
  }
  res.status(401).send('Unauthorized');
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foodType, address, name, phone } = <EditVendorInput>req.body;
  const user = req.user;
  if (user) {
    const existVendor = await FindVendor(user._id);
    if (existVendor !== null) {
      existVendor.address = address;
      existVendor.name = name;
      existVendor.phone = phone;
      existVendor.foodType = foodType;
      const newVendor = await existVendor.save();
      return res.json(newVendor);
    }
    return res.json(existVendor);
  }
  res.status(401).send('Unauthorized');
};

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existVendor = await FindVendor(user._id);
    if (existVendor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      existVendor.coverImages.push(...images);

      const newVendor = await existVendor.save();
      return res.json(newVendor);
    }
  }
  res.status(401).send('Unauthorized');
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existVendor = await FindVendor(user._id);
    if (existVendor !== null) {
      existVendor.serviceAvailable = !existVendor.serviceAvailable;
      const newVendor = await existVendor.save();
      return res.json(newVendor);
    }
    return res.json(existVendor);
  }
  res.status(401).send('Unauthorized');
};

export const AddFood = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
      const { name, description, price, category, foodType, readyTime } = <
        CreateFoodInput
      >req.body;
      const existVendor = await FindVendor(user._id);
      if (existVendor !== null) {
        const files = req.files as [Express.Multer.File];

        const images = files.map((file: Express.Multer.File) => file.filename);

        const createFood = await Food.create({
          vendorId: existVendor.id,
          name,
          description,
          price,
          category,
          foodType,
          readyTime,
          rating: 0,
          images: images,
        });

        existVendor.foods.push(createFood);
        const newVendor = await existVendor.save();
        return res.json(newVendor);
      }
    }
    res.status(401).send('Unauthorized');
  }
);

export const GetFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const foods = await Food.find({ vendorId: user._id });
    if (foods !== null) {
      return res.json(foods);
    }
  }

  res.status(401).send('Unauthorized');
};
