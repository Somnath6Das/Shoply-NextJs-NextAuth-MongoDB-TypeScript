import { Schema, model, models, Document } from "mongoose";

export interface IMsg extends Document {
  email?: string;
  sellerName?: string;
  message?: string;
}

const msgSchema = new Schema<IMsg>(
  {
    email: { type: String, trim: true },
    sellerName: { type: String, trim: true },
    message: { type: String },
  },
  { timestamps: true }
);

const SellerMsg = models?.SellerMsg || model<IMsg>("SellerMsg", msgSchema);
export default SellerMsg;
