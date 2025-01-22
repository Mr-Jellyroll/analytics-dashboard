import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const Dashboard = () => {
  const [deviceData, setDeviceData] = useState({
    heartRate: [],
    temperature: [],
    oxygenLevel: []
  });

  const [deviceStatus, setDeviceStatus] = useState({
    isOnline: true,
    lastUpdate: new Date(),
    batteryLevel: 95
  });

  // Simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = {
        heartRate: [...deviceData.heartRate, generateMockData('heartRate')],
        temperature: [...deviceData.temperature, generateMockData('temperature')],
        oxygenLevel: [...deviceData.oxygenLevel, generateMockData('oxygenLevel')]
      };

      // Keep only last 10 readings
      Object.keys(newData).forEach(key => {
        if (newData[key].length > 10) {
          newData[key] = newData[key].slice(-10);
        }
      });

      setDeviceData(newData);
    }, 2000);

    return () => clearInterval(interval);
  }, [deviceData]);

  const generateMockData = (type) => {
    const timestamp = new Date().toLocaleTimeString();
    switch (type) {
      case 'heartRate':
        return { timestamp, value: 70 + Math.random() * 20 };
      case 'temperature':
        return { timestamp, value: 36.5 + Math.random() * 1 };
      case 'oxygenLevel':
        return { timestamp, value: 95 + Math.random() * 3 };
      default:
        return { timestamp, value: 0 };
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Medical Device Dashboard</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${deviceStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {deviceStatus.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <p className="text-gray-600 mt-1">Last updated: {deviceStatus.lastUpdate.toLocaleString()}</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Heart Rate Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Activity className="text-red-500 mr-2" />
            <h2 className="text-lg font-semibold">Heart Rate</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={deviceData.heartRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Activity className="text-orange-500 mr-2" />
            <h2 className="text-lg font-semibold">Temperature</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={deviceData.temperature}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#f97316" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Oxygen Level Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Activity className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold">Oxygen Level</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={deviceData.oxygenLevel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;