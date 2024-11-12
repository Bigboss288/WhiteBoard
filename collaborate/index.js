const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Sample event for sending data to the client
  socket.on('textChange', (data) => {
    console.log(`Received text data from client: ${data}`);
    // Broadcast the text data to all other clients
    socket.broadcast.emit('textUpdate', data);
  });

  socket.on('stateUpdate', (updatedHistory) => {
    // Broadcast the updated state to all other clients
    socket.broadcast.emit('receiveStateUpdate', updatedHistory);
  });


  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
