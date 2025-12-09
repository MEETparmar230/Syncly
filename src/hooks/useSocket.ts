"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io("ws://localhost:3000/api/socket");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return socket;
}
