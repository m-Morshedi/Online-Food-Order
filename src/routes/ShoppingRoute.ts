import express, { Request, Response, NextFunction } from 'express';
import {
  GetFoodAvailablity,
  GetTopRestaurants,
  SearchFood,
  ResturantById,
  GetFoodIn30Min,
} from '../controllers';

const router = express.Router();

// Food Avalablity
router.get('/:pincode', GetFoodAvailablity);

// Top Resturants
router.get('/top-resturants/:pincode', GetTopRestaurants);

// Foods avalablable in 30 minutes
router.get('/foods-in-30-min/:pincode', GetFoodIn30Min);

// search foods
router.get('/search/:pincode', SearchFood);

// find resturant by id
router.get('/resturant/:id', ResturantById);

export { router as ShoppingRoute };
