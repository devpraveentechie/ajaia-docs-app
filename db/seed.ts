import dotenv from "dotenv";
import { db } from "../lib/db";
import { users } from "./schema";


dotenv.config({ path: ".env.local" });
async function seed() {
  console.log("Seeding database...");

  await db
    .insert(users)
    .values([
      {
        name: "Praveen",
        email: "Praveen@ajaia.com",
      },
      {
        name: "Kumar",
        email: "kumar@ajaia.com",
      },
    ])
    .onConflictDoNothing();

  console.log("Database seeded successfully");

  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});