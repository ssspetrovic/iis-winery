import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from "../../api/axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import BatchCreationForm from './BatchCreateForm.jsx'

function BatchManagement () {
    const [batches, setBatches] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    function toggleModal () {
        setModalOpen(!modalOpen);
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        const response = await axios.get("/batches/");
        setBatches(response.data);
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
                    <ul className="list-group">
                        {batches.map(batch => (
                            <li key={batch.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h5>{batch.name}</h5>
                                    <p>{batch.description}</p>
                                </div>
                                <div>
                                    <button className="btn mr-2" onClick={() => handleUpdateBatch(batch.id)}>Update</button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteBatch(batch.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-primary mt-2" onClick={toggleModal}>Create</button>
                    <Modal isOpen={modalOpen} toggle={toggleModal}>
                        <ModalHeader toggle={toggleModal}><h2 className="mb-3">Add New Batch</h2></ModalHeader>
                        <ModalBody>
                        <BatchCreationForm toggleModal={toggleModal} fetchBatches={fetchBatches}/>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default BatchManagement;
