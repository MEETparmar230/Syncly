"use client";

import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";

interface Message {
  id: number;
  userId: number;
  content: string;
  createdAt?: string;
}

export default function ChatPage({ params }: any) {
  const chatId = params.id;
  const socket = useSocket();

  // Type the state correctly
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // join socket room
  useEffect(() => {
    if (!socket) return;
    socket.emit("join_chat", chatId);

    socket.on("new_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, [socket]);

  // fetch messages
  useEffect(() => {
    fetch(`/api/messages/${chatId}`)
      .then((r) => r.json())
      .then((data: Message[]) => setMessages(data));
  }, []);

  async function sendMessage() {
    const res = await fetch(`/api/messages/${chatId}`, {
      method: "POST",
      body: JSON.stringify({
        userId: 1,
        content: input,
      }),
    });

    setInput("");
  }

  return (
    <div>
      <div className="p-4 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="border p-2 rounded">
            {m.content}
          </div>
        ))}
      </div>

      <div className="p-4 flex gap-2">
        <input
          className="border flex-1 p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage} className="p-2 bg-blue-600 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
}
