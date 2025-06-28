import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  return session;
}
