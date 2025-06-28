import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";

export async function validateUser(email: string, password: string) {
  try {
    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
