import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  variantId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  combination: Record<string, string>;
  itemName: string;
  image: string;
  sellerId: mongoose.Types.ObjectId;
  deliveryInDays: number;
  stock: number;
}
export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}
const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  variantId: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  combination: {
    type: Map,
    of: String,
    required: true,
  },
  itemName: { type: String, required: true },
  image: { type: String, required: true },
  sellerId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  deliveryInDays: { type: Number, required: true },
  stock: { type: Number, required: true },
});
const CartSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true },
);

export default mongoose.models.Cart ||
  mongoose.model<ICart>("Cart", CartSchema);
