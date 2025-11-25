Syncly — Real-Time Chat Application (Next.js + GraphQL + Socket.io)

Syncly is a modern, full-stack real-time messaging application built with Next.js 14, GraphQL, React Query, Socket.io, and NextAuth.
It delivers a fast, seamless, and secure chat experience with a professional architecture inspired by industry standards used by Slack and Discord.

🔥 Core Features

⚡ Real-time messaging with Socket.io

👥 One-to-one & group chats

✍️ Typing indicators

🟢 Online/offline presence

👁️‍🗨️ Message seen status

🔐 OAuth Authentication (Google, GitHub) using NextAuth

🧭 Modern UI with Tailwind CSS + ShadCN UI

📡 GraphQL API with end-to-end type safety

🔍 React Query for caching, data consistency, and infinite message loading

🗄️ MongoDB + Drizzle ORM for scalable data storage

📱 Fully responsive & mobile friendly

🧩 Tech Stack
Frontend + Full stack

Next.js 14 (App Router)

React (Server & Client Components)

Tailwind CSS

ShadCN UI

React Query (TanStack Query)

Zod + React Hook Form

Backend

GraphQL (Yoga or Apollo Server)

Socket.io (real-time)

NextAuth (OAuth + JWT sessions)

Drizzle ORM (with MongoDB)

Rate limiting + secure middleware

Deployment

Vercel (Next.js UI + GraphQL routes)

Render / Railway (Socket.io server)

MongoDB Atlas

🏗 Project Architecture

Syncly follows a clean, scalable architecture:

GraphQL handles structured data fetching (users, chats, messages)

Socket.io handles real-time streams (messages, typing, online status)

React Query synchronizes server data with live events

NextAuth manages user identity & OAuth

Drizzle ORM ensures type-safe database access

🎯 Why I Built Syncly

To demonstrate:

Professional full-stack engineering

Real-time communication systems

GraphQL + WebSocket architecture

Modern Next.js App Router techniques

Clean, production-level UI and code structure

🚀 Roadmap