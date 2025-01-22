# Device Dashboard

This dashboard provides real-time monitoring and historical analysis of IoT device data. Test project is designed for tracking vital signs including heart rate, temperature, and oxygen levels. Uses React for the frontend and Node.js for the backend, and real-time updates through WebSocket connections.

## System Architecture

Built using a full-stack JavaScript architecture:

### Frontend
- **React** for the user interface
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Socket.io-client** for real-time communications
- **Lucide React** for icons and visual elements

### Backend
- **Node.js** with Express
- **MongoDB** for data persistence
- **Socket.io** for real-time data streaming
- **Mongoose** for database modeling

## Features

The dashboard provides comprehensive monitoring capabilities:

### Real-Time Monitoring
- Live vital sign tracking (heart rate, temperature, oxygen levels)
- Automatic updates through WebSocket connection
- Visual alerts for abnormal readings
- Device status monitoring (connection state, battery level)

### Historical Data
- Interactive time-series charts
- Customizable time range selection (24h, 7d, 30d)
- Data persistence in MongoDB

### Alert System
- Real-time alert notifications
- Multiple alert severity levels (warning, critical)
- Auto-dismissing non-critical alerts
- Visual indicators for device status

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

## Application Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── HistoricalData.jsx
│   │   └── common/
│   │       └── Alert.jsx
│   ├── services/
│   │   └── socketService.js
│   ├── App.js
│   └── index.js
```

### Backend Structure
```
backend/
├── src/
│   ├── models/
│   │   └── Device.js
│   └── routes/
│       └── deviceRoutes.js
├── server.js
└── package.json
```

## Technical Details

### Data Flow
1. The backend generates simulated device readings every 2 seconds
2. Readings are stored in MongoDB and simultaneously broadcast to connected clients
3. The frontend receives updates through WebSocket connection
4. Data is displayed in real-time charts and updated historical views