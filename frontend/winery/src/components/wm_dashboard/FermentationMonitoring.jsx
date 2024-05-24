import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from "../../api/axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const FermentationMonitoring = () => {
    const [data, setData] = useState([]);
    const [alert, setAlert] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchWineBatches = async () => {
            const response = await axios.get("/ferm-data/", {
                headers: { "Content-Type": "application/json" },
            });
            const formattedData = response.data.map(item => ({
                ...item,
                timestamp: formatDate(item.timestamp)
            }));
            setData(formattedData);
        };

        fetchWineBatches();

        const socketInstance = new WebSocket('ws://localhost:8000/ws/fermentation/');
        setSocket(socketInstance);

        socketInstance.onopen = () => {
            console.log("Socket Success!");
        };

        socketInstance.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            newData.timestamp = formatDate(newData.timestamp);
            setData(prevData => [...prevData, newData]);

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
            setTimeout(() => {
                const newSocket = new WebSocket('ws://localhost:8000/ws/fermentation/');
                setSocket(newSocket);
            }, 1000);
        };

        return () => {
            socketInstance.close();
        };
    }, []);

    const checkFermentation = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ command: 'check_fermentation' }));
        } else {
            console.warn('WebSocket is not open.');
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h2 className="card-title text-center">Fermentation Monitoring</h2>
                {alert && <div className="alert alert-danger mb-4">{alert}</div>}
                <div className="d-flex justify-content-center mb-4">
                    <LineChart
                        width={400}
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
                <div className="text-center">
                    <button className="btn btn-primary" onClick={checkFermentation}>Check Fermentation</button>
                </div>
            </div>
        </div>
    );
};

export default FermentationMonitoring;
