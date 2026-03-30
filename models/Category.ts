import { Schema, model, models } from "mongoose";

const categorySchema = new Schema(
  {
    main: { type: String, required: true, unique: true },
    subs: { type: [String], default: [] },
  },
  { timestamps: true },
);

const Category = models.Category || model("Category", categorySchema);

export default Category;
