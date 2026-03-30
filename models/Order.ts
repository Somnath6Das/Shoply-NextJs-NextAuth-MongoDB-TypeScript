import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  variantId: { type: Schema.Types.ObjectId, required: true },

  ItemName: { type: String, required: true },
  image: String,
  deliveryInDays: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  combination: { type: Map, of: String, required: true },
});

const OrderAddressSchema = new Schema({
  name: String,
  location: String,
  pin: String,
  phone: String,
});

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    sellerId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    items: [OrderItemSchema],
    address: [OrderAddressSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
