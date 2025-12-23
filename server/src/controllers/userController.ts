import { Request, Response } from "express";
import { redis } from "../redis";

export async function getUserStatus(req: Request, res: Response) {
  const userId = Number(req.params.userId);

  try {
    const isOnline = await redis.exists(`online:${userId}`);
    res.json({ success: true, online: Boolean(isOnline) });
  } catch (e) {
    console.error("Redis error:", e);
    res.json({ success: true, online: false }); 
  }
}
