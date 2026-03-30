"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  async function handleLogin(e: React.FormEvent) {
    setLoading(true);
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      identifier: username.trim(),
      password,
    });
    if (result?.error) {
      setMessage("" + result.error);
      setLoading(false);
    } else {
      console.log("Login successful");
      router.replace("/admin/dashboard");
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center rounded-xl px-3 py-1">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="rounded"
          priority
        />
      </div>
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-center w-sm p-6 bg-white shadow-md shadow-gray-400 rounded-lg space-y-3"
      >
        <h1 className="flex justify-center text-xl font-bold text-green-600">
          Admin Login
        </h1>
        <input
          type="username"
          placeholder="Email"
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-200 p-2 w-full rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-200 p-2 w-full rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-4 py-2 rounded"
          disabled={loading}
        >
          Login
        </button>
        <div className="flex justify-center">
          {message && (
            <p
              className={`text-sm ${
                message.includes("❌") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
