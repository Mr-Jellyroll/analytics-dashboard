import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

const Alert = ({ type, title, message, onClose }) => {
    const alertStyles = {
        warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
        critical: 'bg-red-50 border-red-400 text-red-800'
    };

    return (
        <div className={`border-l-4 p-4 ${alertStyles[type]}`}>
            <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <div className="flex-1">
                    <p className="font-bold">{title}</p>
                    <p className="text-sm">{message}</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="ml-auto">
                        <XCircle className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;