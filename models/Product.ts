import { Schema, model, models } from "mongoose";

const VariantSchema = new Schema(
  {
    combination: { type: Object, required: true },
    price: { type: String, required: true },
    stock: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  { _id: true },
);

const OptionSchema = new Schema({
  name: { type: String, required: true },
  values: { type: [String], required: true },
});

const ProductSchema = new Schema(
  {
    sellerId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    deliveryInDays: { type: String },
    category: {
      main: { type: String, required: true },
      sub: { type: String, required: true },
    },
    options: { type: [OptionSchema], default: [] },
    variants: { type: [VariantSchema], default: [] },
    allImages: { type: [String], default: [] },
  },
  { timestamps: true },
);
const Product = models.Product || model("Product", ProductSchema);
export default Product;
