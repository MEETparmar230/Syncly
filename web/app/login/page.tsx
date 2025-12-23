"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { socket } from "@/lib/socket";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    
if (res.success) {
  localStorage.setItem("token", res.token);

  socket.auth = { token: res.token };
  socket.connect();

  router.push("/chats");
}
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-80 space-y-3">
        <h1 className="text-xl font-bold">Login</h1>
        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="bg-black text-white w-full py-2"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
