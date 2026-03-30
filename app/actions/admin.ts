"use server";

import axios from "axios";

export type Errors = {
  reason?: string;
};
export type FormState = {
  errors: Errors;
  success?: string;
  error?: string;
};
export async function AcceptMessage(
  id: string,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller/seller-msg/accept`,
      { id },
      { validateStatus: () => true },
    );
    if (res.status === 201) {
      return { errors: {}, success: res.data.message };
    } else {
      return { errors: {}, error: res.data.error || "Something went wrong" };
    }
  } catch (error) {
    console.error("Server Action Error:", error);
    return { errors: {}, error: "Server error. Try later." };
  }
}
export async function RejectMessage(
  id: string,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const reason = formData.get("reason") as string;
  const errors: Errors = {};
  if (!reason) {
    errors.reason = "Reason is required!";
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller/seller-msg/reject`,
      { id, reason },
      { validateStatus: () => true },
    );
    if (res.status === 201) {
      return { errors: {}, success: res.data.message };
    } else {
      return { errors: {}, error: res.data.error || "Something went wrong" };
    }
  } catch (error) {
    console.error("Server Action Error:", error);
    return { errors: {}, error: "Server error. Try later." };
  }
}
export async function DeleteRequest(
  id: string,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller/seller-msg/delete`,
      { data: { id }, validateStatus: () => true },
    );
    if (res.status === 200) {
      return { errors: {}, success: res.data.message };
    } else {
      return { errors: {}, error: res.data.error || "Something went wrong" };
    }
  } catch (error) {
    console.error("Server Action Error:", error);
    return { errors: {}, error: "Server error. Try later." };
  }
}
export async function DeleteSeller(
  id: string,
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller/delete-seller`,
      { data: { id }, validateStatus: () => true },
    );
    if (res.status === 200) {
      return { errors: {}, success: res.data.message };
    } else {
      return { errors: {}, error: res.data.error || "Something went wrong" };
    }
  } catch (error) {
    console.error("Server Action Error:", error);
    return { errors: {}, error: "Server error. Try later." };
  }
}
