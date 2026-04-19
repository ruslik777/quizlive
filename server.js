const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Session storage
const sessions = {};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Host creates a session
  socket.on('create_session', ({ sessionId, slides }) => {
    sessions[sessionId] = {
      slides,
      currentSlide: 0,
      participants: {},
      answers: {},
      scores: {},
    };
    socket.join(sessionId);
    socket.emit('session_created', { sessionId });
    console.log('Session created:', sessionId);
  });

  // Participant joins
  socket.on('join_session', ({ sessionId, name }) => {
    if (!sessions[sessionId]) {
      socket.emit('error', { message: 'Session not found' });
      return;
    }
    sessions[sessionId].participants[socket.id] = { name, joinedAt: Date.now() };
    sessions[sessionId].scores[socket.id] = 0;
    socket.join(sessionId);
    socket.emit('joined', { name, sessionId });
    io.to(sessionId).emit('participant_joined', {
      name,
      count: Object.keys(sessions[sessionId].participants).length,
    });
  });

  // Host advances slide
  socket.on('next_slide', ({ sessionId }) => {
    const session = sessions[sessionId];
    if (!session) return;
    session.currentSlide++;
    session.answers = {};
    const slide = session.slides[session.currentSlide];
    io.to(sessionId).emit('slide_changed', { slide, index: session.currentSlide });
  });

  // Participant submits answer
  socket.on('submit_answer', ({ sessionId, answer, timeMs }) => {
    const session = sessions[sessionId];
    if (!session) return;
    const slide = session.slides[session.currentSlide];
    session.answers[socket.id] = answer;

    let points = 0;
    if (slide.correct && answer === slide.correct) {
      // Speed bonus: max 1000 points, reduced by time
      points = Math.max(100, Math.round(1000 - timeMs / 10));
      session.scores[socket.id] = (session.scores[socket.id] || 0) + points;
    }

    socket.emit('answer_result', { correct: answer === slide.correct, points });

    // Send updated leaderboard to host
    const leaderboard = Object.entries(session.scores)
      .map(([id, score]) => ({
        name: session.participants[id]?.name || 'Unknown',
        score,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    io.to(sessionId).emit('leaderboard_update', { leaderboard });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`QuizLive running at http://localhost:${PORT}`);
});
