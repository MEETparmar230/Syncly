import { pgTable, varchar, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
});

export const chatMembers = pgTable("chat_members", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").references(() => chats.id),
  userId: integer("user_id").references(() => users.id),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").references(() => chats.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
});
