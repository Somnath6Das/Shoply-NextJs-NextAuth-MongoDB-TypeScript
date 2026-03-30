"use client";

import LoginView from "@/components/home/LoginView";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { Check } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [otp, setOtp] = useState("");
  const [otoVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [passwordMsg, setpasswordMsg] = useState("");
  const [regMessage, setRegMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }
    setLoading(true);
    setMessage("");
    setOtpEnabled(false);

    try {
      const res = await axios.post("/api/user/register/send-otp", {
        email,
      });
      setMessage("OTP sent to your email address");
      setOtpEnabled(true);
    } catch (error: any) {
      if (error.response?.status === 409) {
        setMessage("Email already registered");
        setOtpEnabled(false);
      } else {
        setMessage("Failed to send OTP");
        setOtpEnabled(false);
      }
    }
    setLoading(false);
  };
  const handleOtpSubmit = async () => {
    if (!otp) {
      setOtpMessage("Enter your OTP");
      return;
    }
    setOtpMessage("");
    try {
      const res = await axios.post("/api/user/register/verify-otp", {
        email,
        otp,
      });
      if (res.data.valid) {
        setOtpVerified(true);
        setOtpMessage("OTP Verified");
      } else {
        setOtpMessage("Wrong OTP");
      }
    } catch (error) {
      console.error(error);
      setOtpMessage("Enter Verify OTP");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!setOtpVerified) {
      setMessage("Please verify OTP first");
      return;
    }
    if (password !== confirmPassword) {
      setpasswordMsg("Password did not match");
      return;
    }
    try {
      const res = await axios.post("/api/user/register/submit", {
        email,
        password,
      });
      setRegMessage("User Registered successfully");
    } catch (error: any) {
      if (error.response?.status === 409) {
        setMessage("Email already registered");
      } else {
        setMessage("Registration failed");
      }
    }
  };
  return (
    <LoginView>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative flex items-center ml-3 mx-3">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setOtpEnabled(false);
              setOtp("");
              setOtpVerified(false);
            }}
            placeholder="Enter your email"
            className="w-full bg-white/70 border border-gray-300 rounded-lg px-3 py-2 pr-10 shadow-sm text-gray-800 placeholder-gray-500 outline-none"
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading}
            className="absolute right-2 bg-white rounded-full p-1.5 border border-gray-300 shadow-sm hover:scale-105 transition-transform"
          >
            <Check className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        {message && (
          <p className="text-sm text-center text-yellow-200">{message}</p>
        )}
        <div className="space-y-2 mb-2">
          <h2 className="text-lg font-medium text-white text-center">
            Enter OTP
          </h2>
          <div className="relative flex justify-center items-center space-x-3 ml-9">
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={!otpEnabled}
            >
              <InputOTPGroup className="space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className={`bg-white/70 border border-gray-300 text-gray-800 rounded-md shadow-sm text-xl ${
                      !otpEnabled ? "opacity-50" : ""
                    }`}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <button
              type="button"
              onClick={handleOtpSubmit}
              disabled={!otpEnabled}
              className={`bg-white rounded-full p-2 border border-gray-300 shadow-sm transition-transform ${
                otpEnabled
                  ? "hover: scale-105"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
          </div>
          {otpMessage && (
            <p className="text-sm text-center text-yellow-200">{otpMessage}</p>
          )}
          <div className="flex flex-col gap-4 mx-3">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!otoVerified}
              className="p-2 rounded-lg border border-gray-300 focus:border-green-500 outline-none bg-white/70 shadow-sm"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!otoVerified}
              className="p-2 rounded-lg border border-gray-300 focus:border-green-500 outline-none bg-white/70 shadow-sm"
            />
          </div>
          {passwordMsg && (
            <p className="text-sm text-center text-yellow-200">{passwordMsg}</p>
          )}
          <button
            type="submit"
            disabled={!otoVerified}
            className="mx-3 mt-2 bg-green-600 text-white py-2 px-6 rounded-lg font-medium shadow-md hover:bg-green-700 transition"
          >
            Submit
          </button>
          {regMessage && (
            <p className="text-sm text-center text-yellow-200">{regMessage}</p>
          )}
        </div>
      </form>
    </LoginView>
  );
}
