import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FermentationDashboard = () => {
    const [data, setData] = useState([]);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        // Fetch initial data
        axios.get('/api/batches/1/') // Replace with your API endpoint
            .then(response => {
                setData(response.data.data);
            });

        // WebSocket connection
        const socket = new WebSocket('ws://localhost:8000/ws/fermentation/');

        socket.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            setData(prevData => [...prevData, newData]);

            // Check conditions for alerts
            if (newData.temperature > 30) {
                setAlert('Temperature is too high!');
            }
        };

        return () => socket.close();
    }, []);

    return (
        <div>
            {alert && <div className="alert alert-danger">{alert}</div>}
            <h2>Fermentation Monitoring</h2>
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                <Line type="monotone" dataKey="sugar_level" stroke="#82ca9d" />
                <Line type="monotone" dataKey="pH" stroke="#ffc658" />
            </LineChart>
        </div>
    );
};

export default FermentationDashboard;
