import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import io from 'socket.io-client';

const Dashboard = () => {
    const [deviceData, setDeviceData] = useState({
        heartRate: [],
        temperature: [],
        oxygenLevel: []
    });

    const [deviceStatus, setDeviceStatus] = useState({
        isOnline: false,
        lastUpdate: new Date(),
        batteryLevel: 95
    });

    useEffect(() => {
        // Create socket connection
        const socket = io('http://localhost:5000');

        // Handle connection status
        socket.on('connect', () => {
            setDeviceStatus(prev => ({
                ...prev,
                isOnline: true
            }));
        });

        socket.on('disconnect', () => {
            setDeviceStatus(prev => ({
                ...prev,
                isOnline: false
            }));
        });

        // Handle incoming device updates
        socket.on('deviceUpdates', (newReading) => {
            setDeviceData(prev => {
                // Create new data points for each metric
                const newData = {
                    heartRate: [...prev.heartRate, { 
                        timestamp: newReading.timestamp,
                        value: newReading.heartRate 
                    }],
                    temperature: [...prev.temperature, {
                        timestamp: newReading.timestamp,
                        value: newReading.temperature
                    }],
                    oxygenLevel: [...prev.oxygenLevel, {
                        timestamp: newReading.timestamp,
                        value: newReading.oxygenLevel
                    }]
                };

                // Keep only last 10 readings for each metric
                Object.keys(newData).forEach(key => {
                    if (newData[key].length > 10) {
                        newData[key] = newData[key].slice(-10);
                    }
                });

                return newData;
            });

            setDeviceStatus(prev => ({
                ...prev,
                lastUpdate: new Date()
            }));
        });

        // Clean up socket connection when component unmounts
        return () => socket.disconnect();
    }, []);

    // Rest of your component remains the same...
    return (
        // Your existing JSX...
    );
};

export default Dashboard;