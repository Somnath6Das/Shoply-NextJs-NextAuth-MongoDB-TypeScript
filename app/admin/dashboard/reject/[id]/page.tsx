"use client";
import { FormState, RejectMessage } from "@/app/actions/admin";
import { ArrowLeft } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export default function RejectRequest() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialState: FormState = {
    errors: {},
  };

  const rejectWithId = RejectMessage.bind(null, params.id as string);
  const [state, formAction, isPending] = useActionState(
    rejectWithId,
    initialState,
  );
  return (
    <Form action={formAction}>
      <div className="flex items-center mb-3.5">
        <Link
          href="/admin/dashboard"
          className="bg-gray-200 rounded-full p-1 mr-2"
        >
          <ArrowLeft />
        </Link>
        <label className="flex font-medium sm:text-base text-sm">
          Please give Reason of Rejecting
        </label>
        <div className="text-blue-500 font-bold">
          {searchParams.get("seller")}
        </div>
      </div>
      <div className="ml-10">
        <div className="space-y-2.5 mb-2">
          <textarea
            name="reason"
            placeholder="Enter the reason"
            rows={2}
            className="w-2xl border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5472f7] resize-none"
          />
          {state.errors.reason && (
            <p className="text-red-500 text-sm">{state.errors.reason}</p>
          )}
        </div>
      </div>
      <div className="ml-10 mt-8 ">
        <div className="flex w-80 h-12 space-x-2">
          <button
            onClick={() => router.back()}
            disabled={isPending}
            className="w-full text-black py-2 sm:py-3 rounded-lg transition text-sm sm:text-base font-medium hover:bg-[#efefef] border-2 border-[#d4d3d3]
            hover:border-[#efefef]
            "
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={`w-full ${isPending ? "bg-gray-300" : "bg-[#3b5ae4]"}
              text-white py-2 sm:py-3 rounded-lg transition text-sm sm:text-base font-medium ${isPending ? "hover:bg-gray-300" : "hover:bg-[#1033cf]"}
              `}
          >
            Submit
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
