import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        {
          error: "Email and OTP required",
        },
        { status: 400 },
      );
    }
    if (global.otpStore && global.otpStore[email] === otp) {
      delete global.otpStore[email];
      return NextResponse.json({ valid: true });
    }
    return NextResponse.json({ valid: false });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
