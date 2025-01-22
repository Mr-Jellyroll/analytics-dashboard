const mongoose = require('mongoose');

// Schema for individual readings
const readingSchema = new mongoose.Schema({
    heartRate: {
        type: Number,
        required: true,
        min: 0,
        max: 300  // Setting reasonable limits for validation
    },
    temperature: {
        type: Number,
        required: true,
        min: 30,
        max: 45
    },
    oxygenLevel: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Define the main device schema
const deviceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true  // Each device should have a unique ID
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'maintenance'],
        default: 'offline'
    },
    readings: [readingSchema],  // Array to store historical readings
    metadata: {
        model: String,
        manufacturer: String,
        lastMaintenance: Date
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Add an index on timestamp
deviceSchema.index({ 'readings.timestamp': -1 });

module.exports = mongoose.model('Device', deviceSchema);