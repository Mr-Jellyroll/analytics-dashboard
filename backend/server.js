const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Device = require('./src/models/Device');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure middleware
app.use(cors());
app.use(express.json());

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error.message);
    });

// Socket.IO connection handler with MongoDB integration
io.on('connection', async (socket) => {
    console.log('Client connected');

    // Create or find a device in the database
    let device = await Device.findOne({ deviceId: 'demo-device-001' });
    if (!device) {
        device = new Device({
            deviceId: 'demo-device-001',
            name: 'Demo Medical Device',
            status: 'online'
        });
        await device.save();
    }

    // Update device status to online
    await Device.findByIdAndUpdate(device._id, { status: 'online' });

    // Simulate device data and store in MongoDB
    const interval = setInterval(async () => {
        try {
            const newReading = {
                heartRate: 70 + Math.random() * 20,
                temperature: 36.5 + Math.random() * 1,
                oxygenLevel: 95 + Math.random() * 3,
                timestamp: new Date()
            };

            // Store the reading in MongoDB
            await Device.findByIdAndUpdate(device._id, {
                $push: {
                    readings: {
                        $each: [newReading],
                        $slice: -100  // Keep only the last 100 readings
                    }
                }
            });

            // Emit the reading to connected clients
            socket.emit('deviceUpdates', newReading);
        } catch (error) {
            console.error('Error storing reading:', error);
        }
    }, 2000);

    // Handle disconnection
    socket.on('disconnect', async () => {
        console.log('Client disconnected');
        clearInterval(interval);
        // Update device status to offline
        await Device.findByIdAndUpdate(device._id, { status: 'offline' });
    });
});

// Add a route to get historical data
app.get('/api/devices/:deviceId/readings', async (req, res) => {
    try {
        const device = await Device.findOne({ deviceId: req.params.deviceId });
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json(device.readings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});