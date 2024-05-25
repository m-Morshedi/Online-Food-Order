import mongoose, { Schema, Document } from 'mongoose';

interface FoodDoc extends Document {
  vendorId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  foodType: [string];
  readyTime: number;
  rating: number;
  images: [string];
}

const FoodSchema = new Schema(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    price: { type: Number, required: true },
    foodType: { type: [String], required: true },
    readyTime: { type: Number },
    rating: { type: Number },
    images: { type: [String] },
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

const Food = mongoose.model<FoodDoc>('Food', FoodSchema);
export { Food };
