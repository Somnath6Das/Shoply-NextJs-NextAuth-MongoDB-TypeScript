import axios from "axios";

export async function createProductAction(formData: {
  name: string;
  description: string;
  deliveryInDays: string;
  mainCategory: string;
  subCategory: string;
  options: { name: string; values: string[] }[];
  variants: {
    combination: any;
    price: string;
    stock: string;
    images: string[];
  }[];
  allImages: string[];
}) {
  const {
    name,
    description,
    deliveryInDays,
    mainCategory,
    subCategory,
    options,
    variants,
    allImages,
  } = formData;
  try {
    const res = await axios.post(
      `/api/products/create`,
      {
        name,
        description,
        deliveryInDays,
        category: { main: mainCategory, sub: subCategory },
        options,
        variants,
        allImages,
      },
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    console.error("Create product error: ", error);
    throw new Error(error.response?.data?.error || "Faild to create product");
  }
}
