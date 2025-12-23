"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { socket } from "@/lib/socket";

type OnlineMap = Record<number, boolean>;

export default function ChatsPage() {
  useAuth();

  const [chats, setChats] = useState<any[]>([]);
  const [onlineMap, setOnlineMap] = useState<OnlineMap>({});

  useEffect(() => {
    apiFetch("/chats").then(res => {
      setChats(res.chats || []);
    });
  }, []);

  useEffect(() => {
    chats.forEach(chat => {
      if (!chat.otherUserId) return;

      apiFetch(`/users/${chat.otherUserId}/status`).then(res => {
        setOnlineMap(prev => ({
          ...prev,
          [chat.otherUserId]: res.online,
        }));
      });
    });
  }, [chats]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (socket.connected) {
        socket.emit("ping");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Your Chats</h1>

      {chats.map(chat => (
        <Link
          key={chat.chatId}
          href={`/chats/${chat.chatId}`}
          className="flex items-center gap-2 border p-2 mt-2"
        >
          <span
            className={`h-3 w-3 rounded-full ${
              onlineMap[chat.otherUserId]
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
          />
          Chat #{chat.chatId}
        </Link>
      ))}
    </div>
  );
}
