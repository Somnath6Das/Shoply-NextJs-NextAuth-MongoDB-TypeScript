"use client";
import { EmailState, ForgetPassword } from "@/app/actions/seller";
import Form from "next/form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const initialState: EmailState = {
    errors: {},
  };
  const [state, fromAction, isPending] = useActionState(
    ForgetPassword,
    initialState,
  );
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="mb-6">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={80}
          height={80}
          priority
          className="object-contain drop-shadow-lg"
        />
      </div>
      <div className="bg-white/30 backdrop-blur-xl shadow-xl rounded-2xl w-85 p-6 border border-white/40 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">
          Forget Password
        </h2>
        <p className="text-sm text-white/80 mb-2">
          Enter registered email to get reset link
        </p>
        <Form
          action={fromAction}
          className="flex flex-col items-center space-y-2 mt-6"
        >
          <div className="w-[89%] text-left">
            <label className="block text-sm font-medium mb-1 text-white/90">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full rounded-lg px-3 py-2 text-sm bg-white/20 text-white placeholder-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div className="flex justify-between items-center gap-3 mt-3 w-[89%]">
            <button
              type="button"
              onClick={() => router.push("/seller")}
              className="w-1/2 bg-white/20 text-white/90 py-2 rounded-lg hover:bg-white/30 transition text-sm font-medium border border-white/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`w-1/2 flex px-2 justify-center items-center gap-2 bg-green-600 text-white py-2 rounded-lg transition text-sm font-medium ${isPending ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"}`}
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
        </Form>
        <div className="flex justify-center items-center mt-2">
          {state.success && (
            <p className="flex text-green-500 font-medium">{state.success}</p>
          )}
          {state.error && (
            <p className="flex text-red-500 font-medium">{state.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
