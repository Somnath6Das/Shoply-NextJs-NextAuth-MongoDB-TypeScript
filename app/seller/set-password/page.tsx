"use client";

import { PasswordState, SetPassword } from "@/app/actions/seller";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

export default function SetPasswordPage() {
  const params = useSearchParams();
  const id = params.get("id");

  const setPasswordWithId = SetPassword.bind(null, id as string);
  const initialState: PasswordState = {
    errors: {},
  };
  const [state, formAction, isPending] = useActionState(
    setPasswordWithId,
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
      <form
        action={formAction}
        className="bg-white/30 backdrop-blur-xl shadow-xl rounded-2xl w-[320px] max-w-md p-6 border border-white/40 text-center"
      >
        <h2 className="text-xl font-semibold mb-4 text-white">
          Set Your Password
        </h2>
        <input
          type="password"
          name="password"
          placeholder="Enter new password"
          className="w-full mb-3 px-3 py-2 rounded-lg border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        {state.errors.password && (
          <p className="text-red-500 text-sm ">{state.errors.password}</p>
        )}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Enter new confirm password"
          className="w-full mb-3 px-3 py-2 rounded-lg border border-white/40 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        {state.errors.confirmPassword && (
          <p className="text-red-500 text-sm ">
            {state.errors.confirmPassword}
          </p>
        )}
        {state.errors.matchPassword && (
          <p className="text-red-500 text-sm">{state.errors.matchPassword}</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-2 rounded-lg text-white transition-all duration-200 ${isPending ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
        >
          {isPending ? "Saving..." : "Save Password"}
        </button>
        <div className="flex justify-center items-center mt-2">
          {state.success && (
            <p className="flex text-green-500 font-medium">{state.success}</p>
          )}
          {state.error && (
            <p className="flex text-red-500 font-medium">{state.error}</p>
          )}
        </div>
      </form>
    </div>
  );
}
