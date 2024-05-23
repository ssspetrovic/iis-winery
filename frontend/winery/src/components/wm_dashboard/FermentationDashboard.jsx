import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FermentationDashboard = () => {
    const [data, setData] = useState([]);
    const [alert, setAlert] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Fetch initial data
        const response = axios.get('/api/batches/1/') // Replace with your API endpoint
            .then(response => {
                setData(response.data.data);
            })
            .catch(error => {
                console.error("Error fetching initial data:", error);
            });

        // WebSocket connection setup
        const socketInstance = new WebSocket('ws://localhost:8000/ws/fermentation/');
        setSocket(socketInstance);
        socketInstance.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            setData(prevData => [...prevData, newData]);

            // Check conditions for alerts
            if (newData.temperature > 30) {
                setAlert('Temperature is too high!');
            } else if (newData.sugar_level < 1) {
                setAlert('Sugar level is too low!');
            } else if (newData.pH < 3 || newData.pH > 4) {
                setAlert('pH level is out of the optimal range!');
            } else {
                setAlert(null);
            }
        };

        socketInstance.onerror = (error) => {
            console.error(`WebSocket error: ${error.message}`);
        };

        socketInstance.onclose = () => {
            console.warn('WebSocket connection closed, attempting to reconnect...');
            // Attempt to reconnect after a delay
            setTimeout(() => {
                const newSocket = new WebSocket('ws://localhost:8000/ws/fermentation/');
                setSocket(newSocket);
            }, 1000);
        };

        return () => {
            socketInstance.close();
        };
    }, []);

    return (
        <div>
            {alert && <div className="alert alert-danger">{alert}</div>}
            <h2>Fermentation Monitoring</h2>
            <LineChart
                width={800}
                height={500}
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
