# 🟡 PacBus Oslo & Bergen

> Real-time Norwegian buses, rendered as Pac-Man.
> Built end-to-end with some vibe coding sessions with Claude as a testing and learn by doing project.

Every yellow dot is a live bus. Delayed buses turn into red ghosts.
Click one to see its line, delay, and speed.
Possible to change icon to normal circles.

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

Deployed on Vecel

https://pacbus-oslo.vercel.app/

