"use client";

import LoginView from "@/components/home/LoginView";
import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      identifier: email,
      password,
    });
    if (result?.error) {
      setMessage("❌" + result.error);
      setLoading(false);
    } else {
      console.log("Login successful");
      router.refresh();
    }
  }
  return (
    <LoginView>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="p-2 rounded-lg border border-gray-300 focus:border-green-500 outline-none bg-white/70"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="p-2 rounded-lg border border-gray-300 focus:border-green-500 outline-none bg-white/70"
        />
        <button
          type="submit"
          disabled={loading}
          className={`py-2 rounded-lg text-white transition ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {message && (
          <p
            className={`text-sm ${message.includes("❌") ? "text-red-600" : "text-green-600"}`}
          >
            {message}
          </p>
        )}
      </form>
    </LoginView>
  );
}
