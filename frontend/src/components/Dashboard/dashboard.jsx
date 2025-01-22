import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, Battery, Clock, Thermometer, Heart, Droplet } from 'lucide-react';
import socketService from '../../services/socketService';
import Alert from '../common/Alert';

const Dashboard = () => {
    // State management
    const [deviceData, setDeviceData] = useState({
        heartRate: [],
        temperature: [],
        oxygenLevel: []
    });

    // Device status
    const [deviceStatus, setDeviceStatus] = useState({
        isOnline: false,
        lastUpdate: new Date(),
        batteryLevel: 95
    });

    // Connection status
    const [alerts, setAlerts] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState({
        isConnected: false,
        message: 'Initializing connection...'
    });

    // Setup WebSocket connection and handlers
    useEffect(() => {
        const handleDataUpdate = (newData) => {
            setDeviceData(prev => {
                // Create new data points for each vital sign
                const newDataPoints = {
                    heartRate: [...prev.heartRate, {
                        timestamp: new Date(newData.timestamp).toLocaleTimeString(),
                        value: newData.heartRate
                    }],
                    temperature: [...prev.temperature, {
                        timestamp: new Date(newData.timestamp).toLocaleTimeString(),
                        value: newData.temperature
                    }],
                    oxygenLevel: [...prev.oxygenLevel, {
                        timestamp: new Date(newData.timestamp).toLocaleTimeString(),
                        value: newData.oxygenLevel
                    }]
                };

                // Keep only the last 10 readings for performance
                Object.keys(newDataPoints).forEach(key => {
                    if (newDataPoints[key].length > 10) {
                        newDataPoints[key] = newDataPoints[key].slice(-10);
                    }
                });

                return newDataPoints;
            });

            // Update device status with latest reading time
            setDeviceStatus(prev => ({
                ...prev,
                lastUpdate: new Date(),
                batteryLevel: prev.batteryLevel - 0.01 // Sim battery drain
            }));
        };

        // Handle connection status changes
        const handleStatusChange = (isConnected, message) => {
            setConnectionStatus({ isConnected, message });
            setDeviceStatus(prev => ({
                ...prev,
                isOnline: isConnected
            }));
        };

        // Handle alerts
        const handleAlert = (type, title, message) => {
            const id = Date.now();
            setAlerts(prev => [...prev, { id, type, title, message }]);

            // Auto-remove non-critical alerts after 5 seconds
            if (type !== 'critical') {
                setTimeout(() => removeAlert(id), 5000);
            }
        };

        // Initialize socket connection
        socketService.connect(handleDataUpdate, handleStatusChange, handleAlert);

        // Cleanup on unmount
        return () => socketService.disconnect();
    }, []);

    // Alert management
    const removeAlert = (alertId) => {
        setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    };

    // Render metric card with chart
    const renderMetricCard = (title, data, color, icon) => (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    {icon}
                    <h2 className="text-lg font-semibold ml-2">{title}</h2>
                </div>
                {data.length > 0 && (
                    <div className="text-2xl font-bold" style={{ color }}>
                        {data[data.length - 1].value.toFixed(1)}
                    </div>
                )}
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="timestamp"
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                    />
                    <YAxis />
                    <Tooltip />
                    <Line 
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">Medical Device Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        {/* Connection Status */}
                        <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                                deviceStatus.isOnline ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <span className="text-sm text-gray-600">
                                {connectionStatus.message}
                            </span>
                        </div>
                        {/* Battery Level */}
                        <div className="flex items-center">
                            <Battery className="h-5 w-5 text-gray-600 mr-1" />
                            <span className="text-sm text-gray-600">
                                {deviceStatus.batteryLevel.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
                {/* Last Update Timestamp */}
                <div className="flex items-center mt-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Last updated: {deviceStatus.lastUpdate.toLocaleString()}</span>
                </div>
            </div>

            {/* Alerts Section */}
            <div className="space-y-2 mb-6">
                {alerts.map(alert => (
                    <Alert
                        key={alert.id}
                        type={alert.type}
                        title={alert.title}
                        message={alert.message}
                        onClose={() => removeAlert(alert.id)}
                    />
                ))}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderMetricCard(
                    "Heart Rate",
                    deviceData.heartRate,
                    "#ef4444",
                    <Heart className="text-red-500 h-6 w-6" />
                )}
                {renderMetricCard(
                    "Temperature",
                    deviceData.temperature,
                    "#f97316",
                    <Thermometer className="text-orange-500 h-6 w-6" />
                )}
                {renderMetricCard(
                    "Oxygen Level",
                    deviceData.oxygenLevel,
                    "#3b82f6",
                    <Droplet className="text-blue-500 h-6 w-6" />
                )}
            </div>

            {/* Simulation Notice */}
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <p className="ml-3 text-sm text-yellow-700">
                        System is running in simulation mode. Data is being generated for demonstration purposes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;