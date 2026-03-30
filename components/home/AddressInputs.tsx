"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "../ui/card";
import { saveAddress } from "@/app/actions/address";
import axios from "axios";

type Props = {
  name: string;
  location: string;
  pin: string;
  phone: string;
};

export default function AddressInputs({ address }: { address: Props }) {
  const [editing, setEditing] = useState(!address);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: address?.name || "",
    location: address?.location || "",
    pin: address?.pin || "",
    phone: address?.phone || "",
  });
  const submitForm = (e: any) => {
    e.preventDefault();
    startTransition(() => {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("location", form.location);
      fd.append("pin", form.pin);
      fd.append("phone", form.phone);

      saveAddress(fd);
    });
    setEditing(false);
  };
  const deleteAddress = async () => {
    try {
      await axios.delete("/api/address/delete");
      window.location.reload();
    } catch (error) {
      console.error("Delete address failed", error);
    }
  };
  return (
    <div className="flex flex-col p-6 w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Delivery Address
        </h2>
        <p className="text-gray-500">Manage your shipping information</p>
      </div>
      {/* Edit form */}
      {editing && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <form
            onSubmit={submitForm}
            className="space-y-5 bg-linear-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Full Name
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                placeholder="John Doe"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Delivery Address
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white min-h-24 resize-none"
                placeholder="Street address, apartment, building, floor..."
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Pincode
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="600001"
                  required
                  value={form.pin}
                  onChange={(e) => setForm({ ...form, pin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Phone Number
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⌛</span> Saving...
                  </span>
                ) : (
                  "Save Address"
                )}
              </button>
              {address && (
                <button
                  type="button"
                  className="px-6 border-2 border-gray-300 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      {!editing && address && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-2 border-gray-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-3 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-lg">
                Saved Address
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {address.name}
                  </p>
                  <p className="text-gray-600 mt-1 leading-relaxed">
                    {address.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <span className="font-medium text-gray-700">
                    {address.pin}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📞</span>
                  <span className="font-medium text-gray-700">
                    {address.phone}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  className="flex-1 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => setEditing(true)}
                >
                  ✏️ Edit Address
                </button>
                <button
                  className="flex-1 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={deleteAddress}
                >
                  🗑️ Delete
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {!address && !editing && (
        <button
          className="group flex items-center justify-center gap-2 w-full py-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
          onClick={() => setEditing(true)}
        >
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
            📍
          </span>
          <span className="text-lg font-semibold text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
            Add Delivery Address
          </span>
        </button>
      )}
    </div>
  );
}
