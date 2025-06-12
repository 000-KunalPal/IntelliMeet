import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { agents, meetings, user } from "@/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const _user: typeof user.$inferInsert = {
    id: "1234567890",
    name: "John",
    email: "john@example.com",
  };

  await db.insert(user).values(_user);
  console.log("New user created!");

  const users = await db.select().from(user);
  console.log("Getting all users from the database: ", users);

  const _agent: typeof agents.$inferInsert = {
    id: "1234567890",
    name: "John",
    instructions: "You are a helpful assistant",
    userId: "1234567890",
  };
  await db.insert(agents).values(_agent);

  const _agents = await db.select().from(agents);
  console.log("Getting all agents from the database: ", _agents);

  const _meeting: typeof meetings.$inferInsert = {
    id: "1234567890",
    name: "John",
    userId: "1234567890",
    agentId: "1234567890",
    status: "upcoming",
  };
  await db.insert(meetings).values(_meeting);

  const _meetings = await db.select().from(meetings);
  console.log("Getting all meetings from the database: ", _meetings);
}

main();
