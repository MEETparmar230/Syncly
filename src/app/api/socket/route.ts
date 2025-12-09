import { Server } from "socket.io";
import { NextRequest } from "next/server";

const io = new Server({
  cors: { origin: "*" },
});

export function GET(req: NextRequest) {
  // Upgrade to WebSocket
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade !== "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  const { socket } = (req as any).upgrade();

  io.attach(socket.server);

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("join_chat", (chatId) => {
      socket.join(`chat_${chatId}`);
    });

    socket.on("disconnect", () => console.log("Socket disconnected"));
  });

  return new Response(null, { status: 101 });
}
