import { connect } from 'mongoose';

export const connectDB = async () => {
  const db = await connect(process.env.MONGO_URL!);

  console.log(`MongoDB Connected: ${db.connection.host}`);

  return db;
};
