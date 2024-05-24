import React, { useState, useEffect } from 'react';
import axios from "../../api/axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function BatchManagement () {
    const [batches, setBatches] = useState([]);
    const [newBatch, setNewBatch] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        const response = await axios.get("/batches/");
        setBatches(response.data);
    };

    const handleCreateBatch = async () => {
        const response = await axios.post("/batches/", newBatch);
        setBatches([...batches, response.data]);
        setNewBatch({ name: '', description: '' });
    };

    const handleUpdateBatch = async (batchId) => {
        const updatedDescription = prompt("Enter new batch description:");
        if (updatedDescription) {
            const response = await axios.put(`/batches/${batchId}/`, { description: updatedDescription });
            setBatches(batches.map(batch => (batch.id === batchId ? response.data : batch)));
        }
    };

    const handleDeleteBatch = async (batchId) => {
        await axios.delete(`/batches/${batchId}/`);
        setBatches(batches.filter(batch => batch.id !== batchId));
    };

    return (
        <div className="container mt-4">
            <div className="card mb-4">
                <div className="card-body">
                    <h3 className="card-title">Batch Management</h3>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Batch Name"
                            value={newBatch.name}
                            onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                        />
                        <textarea
                            className="form-control mt-2"
                            placeholder="Batch Description"
                            value={newBatch.description}
                            onChange={(e) => setNewBatch({ ...newBatch, description: e.target.value })}
                        />
                        <button className="btn btn-success mt-2" onClick={handleCreateBatch}>Create Batch</button>
                    </div>
                    <ul className="list-group">
                        {batches.map(batch => (
                            <li key={batch.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h5>{batch.name}</h5>
                                    <p>{batch.description}</p>
                                </div>
                                <div>
                                    <button className="btn btn-warning mr-2" onClick={() => handleUpdateBatch(batch.id)}>Update</button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteBatch(batch.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BatchManagement;
