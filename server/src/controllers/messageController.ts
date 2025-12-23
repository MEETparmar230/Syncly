import { Request, Response } from "express";
import { getMessages, sendMessage } from "../services/messageService";
import { success } from "zod";

export async function send(req: Request & { userId?: number }, res: Response) {
  try {
    const { chatId, content } = req.body;

    const message = await sendMessage(chatId, req.userId!, content);

    res.status(201).json({ success: true, message });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: error.message || "Forbidden",
    });
  }
}


export async function fetch(req: Request & { userId?: number }, res: Response) {
  try {
    const chatId = Number(req.params.chatId);

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Invalid chatId",
      });
    }

    const messages = await getMessages(chatId, req.userId!);
    res.json({ success: true, messages });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: error.message || "Forbidden",
    });
  }
}

