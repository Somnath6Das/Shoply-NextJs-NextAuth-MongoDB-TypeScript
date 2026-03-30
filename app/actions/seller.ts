"use server";
import axios from "axios";

export type Errors = {
  email?: string;
  sellerName?: string;
  message?: string;
};

export type FormState = {
  errors: Errors;
  success?: string;
  error?: string;
};

export async function sellerMsg(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get("email") as string;
  const sellerName = formData.get("sellerName") as string;
  const message = formData.get("message") as string;

  const errors: Errors = {};
  if (!email) {
    errors.email = "Email is required!";
  }
  if (!sellerName) {
    errors.sellerName = "Seller name is required!";
  }
  if (!message) {
    errors.message = "Message is required!";
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller/seller-msg`,
      { email, sellerName, message },
      { validateStatus: () => true },
    );
    if (res.status === 201) {
      return { errors: {}, success: res.data.message };
    } else {
      return { errors: {}, error: res.data.error || "Something went wrong" };
    }
  } catch (err: unknown) {
    console.log("Server Action Error:", err);
    return { errors: {}, error: "Server error. try later." };
  }
}
export type PasswordErrors = {
  password?: string;
  confirmPassword?: string;
  matchPassword?: string;
};

export type PasswordState = {
  errors: PasswordErrors;
  success?: string;
  error?: string;
};

export async function SetPassword(
  id: string,
  prevState: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const errors: PasswordErrors = {};
  if (!password) {
    errors.password = "Password is required!";
  }
  if (!confirmPassword) {
    errors.confirmPassword = "Confirm Password is required!";
  }
  if (password !== confirmPassword) {
    errors.matchPassword = "Password did not match!";
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller/seller-verified`,
      { id, password },
      { validateStatus: () => true },
    );
    console.log("Api response", res.status, res.data);
    if (res.status === 200) {
      return { errors: {}, success: res.data.message };
    } else {
      return { errors: {}, error: res.data.error || "Something went wrong1" };
    }
  } catch (error) {
    console.error("Server Action Error", error);
    return { errors: {}, error: "Server error. Try later" };
  }
}

export type EmailErrors = {
  email?: string;
};
export type EmailState = {
  errors: EmailErrors;
  success?: string;
  error?: string;
};
export async function ForgetPassword(
  prevState: EmailState,
  formData: FormData,
): Promise<EmailState> {
  const email = formData.get("email") as string;
  const errors: EmailErrors = {};
  if (!email) {
    errors.email = "Email is required!";
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/seller/forget-password`,
      { email },
      { validateStatus: () => true },
    );
    console.log("API Response:", res.status, res.data);
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
