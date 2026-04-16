# 🟡 PacBus Oslo

> Real-time Norwegian buses, rendered as Pac-Man.
> Built end-to-end with some vibe coding sessions with Claude as a testing project.

Every yellow dot is a live bus. Delayed buses turn into red ghosts.
Click one to see its line, delay, and speed.

---

## ✨ Features

- 🗺️ **Live map** of real Oslo & Bergen buses, trains & ferries
- 🎮 **Gamified** — Pac-Man sprites, ghost mode, on-time scores
- ⚡ **Real-time** — auto-refreshes every 10 seconds
- 🎨 **Dark arcade theme** with CartoDB tiles
- 📊 **Stats panel** — active buses, delays, fastest lines
- 🔊 **Retro sound effects** (togglable)

---

## 🛠️ Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Map | Leaflet + react-leaflet |
| Tiles | CartoDB Dark Matter |
| Data | TanStack Query (10s polling) |
| Styling | Tailwind CSS |
| Graphics | HTML5 Canvas (Pac-Man sprites) |
| API | Entur GraphQL (free Norwegian transit data) |

---

## 🏗️ Architecture












This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

