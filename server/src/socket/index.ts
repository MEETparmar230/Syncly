import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { messagesTable } from "../db/schema";
import db from "../db";
import { redis } from "../redis";
import { and, eq, ne } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET!;

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("❌ No token");
      return next(new Error("Unauthorized"));
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
      socket.data.userId = payload.userId;
      next();
    } catch (err) {
      console.log("❌ Invalid token", err);
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {

    const userId = socket.data.userId;

    console.log("✅ User connected:", userId);

    await redis.set(`online:${userId}`, "1", "EX", 60)

    socket.on("join-chat", (chatId: number) => {
      socket.join(`chat:${chatId}`);
      console.log(`User ${socket.data.userId} joined chat ${chatId}`);
    });

    socket.on("send-message", async ({ chatId, content }) => {
      const [message] = await db
        .insert(messagesTable)
        .values({
          chatId,
          senderId: socket.data.userId,
          content,
        })
        .returning();

      io.to(`chat:${chatId}`).emit("new-message", {
        ...message,
        delivered: false,
        seen: false,
      });

    });

    socket.on("message-delivered", async ({ messageId }) => {
      const [msg] = await db
        .select({ chatId: messagesTable.chatId })
        .from(messagesTable)
        .where(eq(messagesTable.id, messageId));

      if (!msg) return;

      await db
        .update(messagesTable)
        .set({ delivered: true })
        .where(eq(messagesTable.id, messageId));

      socket.to(`chat:${msg.chatId}`).emit("message-status-update", {
        messageId,
        delivered: true,
      });
    });


    socket.on("message-seen", async ({ chatId }) => {
      await db
        .update(messagesTable)
        .set({ seen: true })
        .where(
          and(
            eq(messagesTable.chatId, chatId),
            ne(messagesTable.senderId, socket.data.userId),
            eq(messagesTable.seen, false)
          )
        );

      socket.to(`chat:${chatId}`).emit("messages-seen", { chatId });
    });



    socket.on("ping", async () => {
      await redis.set(`online:${userId}`, "1", "EX", 60);
    });


    socket.on("disconnect", async () => {
      console.log("👋 User disconnected:", userId);

      await redis.del(`online:${userId}`)
    });


  });

  return io;
}
