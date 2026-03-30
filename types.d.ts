import { Connection } from "mongoose";

declare global {
  var mongoose: {
    Types: any;
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
  var otpStore: Record<string, string> | undefined;
}

export {};
