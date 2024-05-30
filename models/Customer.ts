import mongoose, { Schema, Document } from 'mongoose';

export interface CustomerDoc extends Document {
  email: string;
  password: string;
  phone: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
}

const Customerchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    verified: { type: Boolean, default: false },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Customer = mongoose.model<CustomerDoc>('Customer', Customerchema);
export { Customer };
