"use client";

import { DeleteSeller, FormState } from "@/app/actions/admin";
import { ArrowLeft } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export default function DeleteSellerAccount() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialState: FormState = {
    errors: {},
  };
  const deleteSellerWithId = DeleteSeller.bind(null, params.id as string);

  const [state, formAction, isPending] = useActionState(
    deleteSellerWithId,
    initialState,
  );
  return (
    <Form action={formAction}>
      <div className="flex items-center mb-3.5">
        <Link
          href="/admin/dashboard/sellers-account"
          className="bg-gray-200 rounded-full p-1 mr-2"
        >
          <ArrowLeft />
        </Link>
        <label className="flex font-medium gap-2 text-[20px]">
          Do you want to delete
          <div className="text-blue-500 font-bold">
            {searchParams.get("seller")}
          </div>
          account?
        </label>
      </div>
      <div className="ml-10 mt-8">
        <div className="flex w-80 h-12 space-x-2">
          <button
            onClick={() => router.back()}
            disabled={isPending}
            className="w-full text-black py-2 sm:py-3 rounded-lg transition text-sm sm:text-base font-medium hover:bg-[#efefef] border-2 border-[#d4d3d3] hover:border-[#efefef]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={`w-full ${isPending ? "bg-gray-400" : "bg-[#f43e3e]"} text-white py-2 sm:py-3 rounded-lg transition text-sm sm:text-base font-medium hover:bg-[#f31414]`}
          >
            Ok
          </button>
        </div>
        <div className="flex w-2xl justify-start items-center mt-2">
          {state.success && (
            <p className="flex text-green-500 font-medium">{state.success}</p>
          )}
          {state.error && (
            <p className="flex text-red-500 font-medium">{state.error}</p>
          )}
        </div>
      </div>
    </Form>
  );
}
