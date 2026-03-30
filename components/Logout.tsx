"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

const Logout = ({ path }: { path: string }) => {
  const [loading, setLoading] = useState(false);
  const handleLogout = () => {
    setLoading(true);
    try {
      signOut({
        redirect: true,
        callbackUrl: path,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-lg bg-red-700 hover:bg-red-900 transition h-10 ${
        loading ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <LogOut size={15} />
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        "Logout"
      )}
    </button>
  );
};

export default Logout;
