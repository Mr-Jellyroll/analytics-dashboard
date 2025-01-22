const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings for frontend
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A client connected');

    // Simulate sending device updates every 2 seconds
    const interval = setInterval(() => {
        const mockData = {
            heartRate: 70 + Math.random() * 20,
            temperature: 36.5 + Math.random() * 1,
            oxygenLevel: 95 + Math.random() * 3,
            timestamp: new Date()
        };
        socket.emit('deviceUpdates', mockData);
    }, 2000);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

// Existing Express routes...

const PORT = process.env.PORT || 5000;
// Use 'server' instead of 'app' to listen
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});