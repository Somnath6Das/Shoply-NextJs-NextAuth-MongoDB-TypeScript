import axios from "axios";

export async function deleteProduct(productId: string) {
  const res = await axios.delete(`/api/products/delete`, {
    data: { productId },
  });
  return res.data;
}
