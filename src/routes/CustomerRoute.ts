import express, { Request, Response, NextFunction } from 'express';
import {
  CustomerLogin,
  GetCustomerProfile,
  CustomerSignup,
  RequestOtp,
  CustomerVerify,
  EditCustomerProfile,
} from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();

// sign up
router.post('/signup', CustomerSignup);

// login
router.post('/login', CustomerLogin);

// authentication
router.use(Authenticate);

// verify customer account
router.patch('/verify', CustomerVerify);

// OTP
router.get('/otp', RequestOtp);

// profile
router.get('/profile', GetCustomerProfile);

router.patch('/profile', EditCustomerProfile);

export { router as CustomerRoute };
