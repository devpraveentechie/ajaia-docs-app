import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import { cookies } from "next/headers";

dotenv.config({ path: ".env.local" });

const DEFAULT_USER_ID =
  process.env.DEMO_USER_ID;

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const cookieUserId =
    cookieStore.get("demo-user-id")?.value;

  const userId =
    cookieUserId || DEFAULT_USER_ID;

  if (!userId) {
    throw new Error(
      "No demo user configured",
    );
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] ?? null;
}