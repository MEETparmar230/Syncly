"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleRegister() {
    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (res.success) router.push("/login");
    else alert("Registration failed");
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-80 space-y-3">
        <h1 className="text-xl font-bold">Register</h1>
        <input className="border p-2 w-full" placeholder="Name"
          onChange={e => setName(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Email"
          onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 w-full" type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)} />
        <button className="bg-black text-white w-full py-2"
          onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}
