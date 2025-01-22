import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

const HistoricalData = () => {
    // State to store our historical readings
    const [historicalData, setHistoricalData] = useState([]);
    const [timeRange, setTimeRange] = useState('24h'); // Default to last 24 hours
    const [isLoading, setIsLoading] = useState(true);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Fetch historical data when component mounts or timeRange changes
    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5000/api/devices/demo-device-001/readings');
                const data = await response.json();

                // Process the data to format timestamps and sort by date
                const processedData = data.map(reading => ({
                    ...reading,
                    timestamp: new Date(reading.timestamp).toLocaleString()
                })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                setHistoricalData(processedData);
            } catch (error) {
                console.error('Error fetching historical data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistoricalData();
    }, [timeRange]);

    // Function to render individual metric charts
    const renderMetricChart = (title, dataKey, color) => (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <select 
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="border rounded p-1 text-sm"
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}> {/* Increased height for better readability */}
                <LineChart 
                    data={historicalData}
                    margin={{ 
                        top: 10,    // Space at the top of the chart
                        right: 30,  // Space for the rightmost values
                        left: 20,   // Space for the y-axis labels
                        bottom: 50  // Increased bottom margin for x-axis labels
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="timestamp"
                        tick={{ fontSize: 12 }}
                        angle={-45}  // Angle the labels for better fit
                        textAnchor="end"  // Align the rotated text
                        tickFormatter={formatTimestamp}  // Use custom formatter
                        height={40}  // Increased height for the x-axis
                        interval="preserveStart"  // More consistent intervals
                    />
                    <YAxis 
                        tick={{ fontSize: 12 }}
                        width={40}  // More space for y-axis labels
                    />
                    <Tooltip 
                        labelFormatter={(label) => new Date(label).toLocaleString()}
                        contentStyle={{ fontSize: '12px' }}
                    />
                    <Line 
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        dot={false}
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Historical Data Analysis</h2>
                <p className="text-gray-600">View and analyze past device readings</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                {renderMetricChart('Heart Rate History', 'heartRate', '#ef4444')}
                {renderMetricChart('Temperature History', 'temperature', '#f97316')}
                {renderMetricChart('Oxygen Level History', 'oxygenLevel', '#3b82f6')}
            </div>
        </div>
    );
};

export default HistoricalData;