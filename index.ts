require('dotenv').config();
import express from 'express';
import { connectDB } from './config/db';
import path from 'node:path';

import { AdminRoute, VendorRoute } from './routes';

const app = express();
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/admin', AdminRoute);
app.use('/vendor', VendorRoute);

app.listen(process.env.PORT, () => {
  console.clear();
  console.log(`server is running on port ${process.env.PORT}`);
});
