import { Request, Response } from "express";
import { createOneToOneChat, getUserChats } from "../services/chatService";
import { redis } from "../redis";

export async function createChat(
  req: Request & { userId?: number },
  res: Response
) {
  console.log("USER ID:", req.userId);

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { otherUserId } = req.body;

  // ✅ Add validation here
  if (!otherUserId) {
    return res.status(400).json({ message: "otherUserId is required" });
  }

  if (typeof otherUserId !== "number") {
    return res.status(400).json({
      message: "otherUserId must be a number",
      received: typeof otherUserId,
      value: otherUserId,
    });
  }

  try {
    console.log(`Creating chat between ${req.userId} and ${otherUserId}`);
    const result = await createOneToOneChat(req.userId, otherUserId);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Chat creation error:", error);

    // Handle specific errors
    if (error instanceof Error) {
      const message = error.message;

      if (message === "User not found") {
        return res.status(404).json({
          message: "User not found",
          otherUserId,
        });
      }

      if (message === "Cannot create chat with yourself") {
        return res.status(400).json({
          message: "Cannot create chat with yourself",
        });
      }

      if (message === "Invalid existing chat state") {
        return res.status(500).json({
          message: "Invalid chat state",
        });
      }

      if (message === "Chat creation failed") {
        return res.status(500).json({
          message: "Failed to create chat",
        });
      }

      // Log unexpected errors with full details
      console.error("Unexpected error details:", {
        message: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getChats(
  req: Request & { userId?: number },
  res: Response
) {
  const chats = await getUserChats(req.userId!);
  res.json({ success: true, chats });
}
