import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../types/authSchema";
import { loginUser, registerUser } from "../services/authService";

export async function register(req: Request, res: Response) {
  const body = registerSchema.parse(req.body);

  const user = await registerUser(
    body.name,
    body.email,
    body.password
  );

  res.status(201).json({ success: true, user });
}

export async function login(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);

  const result = await loginUser(body.email, body.password);

  res.json({ success: true, ...result });
}
