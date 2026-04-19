# QuizLive

> Self-hosted interactive quiz platform for live events, bars, corporate games, and education.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?logo=socket.io)
![License](https://img.shields.io/badge/license-MIT-blue)
![Self-hosted](https://img.shields.io/badge/deployment-self--hosted-orange)

---

## What is QuizLive?

QuizLive is an open-source alternative to AhaSlides and Slido. Host real-time interactive sessions where participants join via QR code — no app required, just a browser.

Built for event hosts, educators, and anyone who needs a live audience engagement tool they can run on their own server.

---

## Features

### Slide types
- **Multiple choice** — classic quiz with one correct answer
- **Poll** — open voting, no right or wrong
- **Text input** — participants type a free-form answer
- **Match pairs** — drag-and-drop matching
- **Sort order** — arrange items in the correct sequence
- **Wheel of fortune** — random spin to select a participant or option
- **Q&A** — open question board

### Platform
- Join via **QR code** — no registration, no app install
- **Speed-based scoring** — faster correct answers earn more points
- **Leaderboard** — live ranking after each question
- **Presentation templates** — reusable quiz structures
- Real-time sync via **WebSockets**

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Frontend | Vanilla HTML / CSS / JS |
| Process manager | PM2 |

No database required for basic usage. Stateless session architecture.

---

## Getting started

### Requirements
- Node.js 18+
- PM2 (optional, for production)

### Install

```bash
git clone https://github.com/YOUR_USERNAME/quizlive.git
cd quizlive
npm install
```

### Run (development)

```bash
node server.js
```

### Run (production with PM2)

```bash
pm2 start server.js --name quizlive
pm2 save
```

Default port: **3000**

Open `http://localhost:3000` to access the host interface.

Participants connect via QR code shown on the lobby screen.

---

## How it works

```
Host creates session → QR code displayed → Participants scan & join
      ↓
Host starts quiz → Slides shown in sync → Answers collected in real-time
      ↓
Speed-based scoring calculated → Leaderboard updated → Next slide
```

---

## Roadmap

- [ ] Persistent sessions (SQLite)
- [ ] Custom branding per session
- [ ] Export results to Excel
- [ ] Image and media slides
- [ ] Fullscreen presenter mode
- [ ] Auto-reconnect on disconnect

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

MIT
