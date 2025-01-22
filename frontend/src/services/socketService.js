import io from 'socket.io-client';

// Create a class to manage our socket connection
class SocketService {
    constructor() {
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 5000;
    }

    connect(onDataUpdate, onStatusChange, onAlert) {
        // Initialize socket with reconnection options
        this.socket = io('http://localhost:5000', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: this.maxReconnectAttempts
        });

        // Connection event handlers
        this.socket.on('connect', () => {
            this.reconnectAttempts = 0;
            onStatusChange(true, 'Connected successfully');
        });

        this.socket.on('disconnect', (reason) => {
            onStatusChange(false, `Disconnected: ${reason}`);
            this.handleDisconnection(onStatusChange);
        });

        // Data handling
        this.socket.on('deviceUpdates', (data) => {
            // Validate incoming data
            if (this.validateData(data)) {
                // Check for concerning values
                this.checkAlertConditions(data, onAlert);
                onDataUpdate(data);
            }
        });

        // Error handling
        this.socket.on('connect_error', (error) => {
            onStatusChange(false, `Connection error: ${error.message}`);
        });
    }

    validateData(data) {
        const requiredFields = ['heartRate', 'temperature', 'oxygenLevel', 'timestamp'];
        const isValid = requiredFields.every(field => field in data);
        
        const isInRange = {
            heartRate: data.heartRate >= 40 && data.heartRate <= 200,
            temperature: data.temperature >= 35 && data.temperature <= 42,
            oxygenLevel: data.oxygenLevel >= 70 && data.oxygenLevel <= 100
        };

        return isValid && Object.values(isInRange).every(Boolean);
    }

    checkAlertConditions(data, onAlert) {
        if (data.heartRate > 120 || data.heartRate < 50) {
            onAlert('warning', 'Heart Rate', `Abnormal heart rate detected: ${data.heartRate} BPM`);
        }
        if (data.temperature > 38.5 || data.temperature < 36) {
            onAlert('warning', 'Temperature', `Abnormal temperature detected: ${data.temperature}°C`);
        }
        if (data.oxygenLevel < 90) {
            onAlert('critical', 'Oxygen Level', `Low oxygen saturation: ${data.oxygenLevel}%`);
        }
    }

    handleDisconnection(onStatusChange) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            onStatusChange(false, `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.socket.connect();
            }, this.reconnectInterval);
        } else {
            onStatusChange(false, 'Maximum reconnection attempts reached. Please refresh the page.');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

// Create and export a single instance of the service
const socketService = new SocketService();
export default socketService;