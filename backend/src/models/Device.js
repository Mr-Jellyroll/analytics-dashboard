const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true
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
    lastReading: {
        heartRate: Number,
        temperature: Number,
        oxygenLevel: Number,
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    metadata: {
        model: String,
        manufacturer: String,
        lastMaintenance: Date
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Device', deviceSchema);