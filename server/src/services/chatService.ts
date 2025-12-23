import { and, eq, inArray, ne, sql } from "drizzle-orm";
import db from "../db";
import { chatMembersTable, chatsTable, usersTable } from "../db/schema";

export async function createOneToOneChat(
  userId: number,
  otherUserId: number
): Promise<{ chatId: number; isNew: boolean }> {
  if (userId === otherUserId) {
    throw new Error("Cannot create chat with yourself");
  }

  // 1️⃣ Check other user exists
  const otherUserResult = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.id, otherUserId));

  const otherUser = otherUserResult[0];
  if (!otherUser) {
    throw new Error("User not found");
  }

  // 2️⃣ Check existing chat
  const existingChats = await db
    .select({ chatId: chatMembersTable.chatId })
    .from(chatMembersTable)
    .where(inArray(chatMembersTable.userId, [userId, otherUserId]))
    .groupBy(chatMembersTable.chatId)
    .having(sql`count(*) = 2`); // ✅ Fixed: was "sq" instead of "sql"

  if (existingChats.length > 0) {
    const chatId = existingChats[0]?.chatId;
    if (!chatId) {
      throw new Error("Invalid existing chat state");
    }

    return { chatId, isNew: false };
  }

  // 3️⃣ Create new chat (transaction)
  return await db.transaction(async (tx) => {
    const insertedChats = await tx
      .insert(chatsTable)
      .values({ isGroup: false })
      .returning({ id: chatsTable.id });

    const chat = insertedChats[0];
    if (!chat) {
      throw new Error("Chat creation failed");
    }

    await tx.insert(chatMembersTable).values([
      { chatId: chat.id, userId },
      { chatId: chat.id, userId: otherUserId },
    ]);

    return { chatId: chat.id, isNew: true };
  });
}


export async function getUserChats(userId: number) {
  return db
    .select({
      chatId: chatsTable.id,
      isGroup: chatsTable.isGroup,
      otherUserId: chatMembersTable.userId,
    })
    .from(chatsTable)
    .innerJoin(
      chatMembersTable,
      eq(chatMembersTable.chatId, chatsTable.id)
    )
    .where(
      and(
        eq(chatsTable.isGroup, false),
        ne(chatMembersTable.userId, userId)
      )
    );
}