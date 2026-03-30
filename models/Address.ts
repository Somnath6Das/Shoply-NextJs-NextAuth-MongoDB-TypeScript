import { Schema, model, models, Document } from "mongoose";

export interface IAddress extends Document {
  userId?: string;
  name?: string;
  location?: string;
  pin: string;
  phone?: string;
}

const AddressSchema = new Schema<IAddress>(
  {
    userId: { type: String, required: true },
    name: { type: String, default: "" },
    location: { type: String, default: "" },
    pin: { type: String, required: true },
    phone: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
  },
);

const Address = models?.Address || model<IAddress>("Address", AddressSchema);
export default Address;
