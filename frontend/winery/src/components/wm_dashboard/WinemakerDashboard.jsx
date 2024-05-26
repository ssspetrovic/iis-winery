import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BatchManagement from './BatchManagement';
import FermentationMonitoring from './FermentationMonitoring';

const WinemakerDashboard = () => {
    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col-md-6">
                    <FermentationMonitoring />
                </div>
                <div className="col-md-6">
                    <BatchManagement />
                </div>
            </div>
        </div>
    );
};

export default WinemakerDashboard;
