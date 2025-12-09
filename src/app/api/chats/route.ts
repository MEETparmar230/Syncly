import { db } from "@/db";
import { chats } from "@/db/schema";

export async function GET() {
  const allChats = await db.select().from(chats);
  return Response.json(allChats);
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await db.insert(chats).values({ name: body.name }).returning();
  return Response.json(created[0]);
}
