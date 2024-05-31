require('dotenv').config();
import express from 'express';
import { connectDB } from '../config/db';
import path from 'node:path';

import {
  AdminRoute,
  VendorRoute,
  ShoppingRoute,
  CustomerRoute,
} from '../routes';

export default async (app: express.Application) => {
  app.use('/images', express.static(path.join(__dirname, 'images')));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  connectDB();

  app.use('/admin', AdminRoute);
  app.use('/vendor', VendorRoute);
  app.use('/customer', CustomerRoute);
  app.use(ShoppingRoute);

  return app;
};
