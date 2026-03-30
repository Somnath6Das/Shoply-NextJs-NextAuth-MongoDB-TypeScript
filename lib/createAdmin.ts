import { connectToDatabase } from "./db";
import User from "../models/User";
import bcrypt from "bcryptjs";

export async function createAdmin() {
  await connectToDatabase();
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.warn("Missing ADMIN_USERNAME or ADMIN_PASSWORD in .env");
    return;
  }
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!existingAdmin) {
      await User.create({
        username,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin account created automatically");
    } else {
      existingAdmin.username = username;
      existingAdmin.password = hashedPassword;

      await existingAdmin.save();
      console.log("Admin credentials updated");
    }
  } catch (error) {
    console.error("Error creating/updating admin:", error);
  }
}
