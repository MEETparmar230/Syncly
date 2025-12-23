import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import db from "../db";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    });

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .then((res) => res[0]);

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, userId: user.id };
}
