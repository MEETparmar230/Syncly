
import { db } from "@/db";
import { messages } from "@/db/schema";
import { getIO } from "@/lib/socket";
import { eq } from "drizzle-orm";

export async function GET(_: Request, { params }: any) {
  const { chatId } = params;

  const data = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, Number(chatId)))
    .orderBy(messages.createdAt);

  return Response.json(data);
}

export async function POST(req: Request, { params }: any) {
  const { chatId } = params;
  const body = await req.json();

  const saved = await db.insert(messages).values({
    chatId: Number(chatId),
    userId: body.userId,
    content: body.content,
  }).returning();

  const io = getIO(); // server-side Socket.IO
  io.to(`chat_${chatId}`).emit("new_message", saved[0]);

  return Response.json(saved[0]);
}

