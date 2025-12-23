"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { socket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

type Message = {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string;
  delivered: boolean;
  seen: boolean;
};

export default function ChatPage() {
  useAuth();
  const { chatId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  

useEffect(() => {
  const deliveredHandler = ({
    messageId,
    delivered,
  }: {
    messageId: number;
    delivered: boolean;
  }) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId ? { ...m, delivered } : m
      )
    );
  };

  const seenHandler = () => {
    setMessages(prev =>
      prev.map(m => ({ ...m, seen: true }))
    );
  };

  socket.on("message-status-update", deliveredHandler);
  socket.on("messages-seen", seenHandler);

  return () => {
    socket.off("message-status-update", deliveredHandler);
    socket.off("messages-seen", seenHandler);
  };
}, []);




  useEffect(() => {
    apiFetch(`/messages/${chatId}`).then(res => {
      setMessages(res.messages || []);
    });

    socket.emit("join-chat", Number(chatId));

    socket.on("new-message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("new-message");
    };
  }, [chatId]);

  function sendMessage() {
    socket.emit("send-message", {
      chatId: Number(chatId),
      content: text,
    });
    setText("");
  }

  return (
    <div className="p-4">
      <div className="h-96 border overflow-y-auto mb-2">
        {messages.map(m => (
          <div key={m.id} className="p-1">
            <b>{m.senderId}:</b> {m.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border flex-1 p-2"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          className="bg-black text-white px-4"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
