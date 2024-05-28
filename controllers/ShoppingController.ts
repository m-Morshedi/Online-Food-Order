import express, { Request, Response, NextFunction } from 'express';
import { Vendor, FoodDoc } from '../models';

export const GetFoodAvailablity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pinCode = req.params.pincode;
  const result = await Vendor.find({
    pinCode: pinCode,
    serviceAvailable: true,
  })
    .sort({ rating: -1 })
    .populate('foods');
  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: 'No food found' });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pinCode = req.params.pincode;
  const result = await Vendor.find({
    pinCode: pinCode,
    serviceAvailable: true,
  })
    .sort({ rating: -1 })
    .limit(10);
  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: 'No resturant found' });
};

export const GetFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pinCode = req.params.pincode;
  const result = await Vendor.find({
    pinCode: pinCode,
    serviceAvailable: true,
  }).populate('foods');
  if (result.length > 0) {
    let foodResult: any = [];
    result.map((vendor) => {
      const foods = vendor.foods as [FoodDoc];
      foodResult.push(...foods.filter((food) => food.readyTime < 30));
    });
    return res.status(200).json(foodResult);
  }
  return res.status(404).json({ message: 'No resturant found' });
};

export const SearchFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pinCode = req.params.pincode;
  const result = await Vendor.find({
    pinCode: pinCode,
    serviceAvailable: true,
  }).populate('foods');
  if (result.length > 0) {
    let foodResult: any = [];
    result.map((item) => {
      foodResult.push(...item.foods);
    });
    return res.status(200).json(foodResult);
  }
  return res.status(404).json({ message: 'No food found' });
};

export const ResturantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const result = await Vendor.findById(id);
  if (result) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: 'No resturant found' });
};
