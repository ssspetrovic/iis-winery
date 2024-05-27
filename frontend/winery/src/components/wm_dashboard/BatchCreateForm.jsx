import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import useAuth from "../../hooks/useAuth";

function BatchCreationForm({ toggleModal, fetchBatches }) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [wineId, setWineId] = useState("");
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState("");
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [wines, setWines] = useState([]);
  const { auth } = useAuth();
  const { username } = auth || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !startDate || !wineId || !estimatedCompletionTime || !status) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(`/batches/`, {
        name: name,
        start_date: startDate,
        wine: wineId,
        winemaker_username: username,
        estimated_completion_date: estimatedCompletionTime,
        status: status,
      });

      setName("");
      setStartDate("");
      setWineId("");
      setWinemakerId("");
      setEstimatedCompletionTime("");
      setStatus("");
      setErrorMessage("");
      setSuccessModal(true);
      fetchBatches(); 
      toggleModal();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to create batch. Please try again later.");
    }
  };

  const onCancel = () => {
    toggleModal();
  } 

  const fetchWines = async () => {
    try {
      const response = await axios.get(`/wines/`);
      setWines(response.data);
    } catch (error) {
      console.error("Error fetching wines:", error);
    }
  };

  useEffect(() => {
    fetchWines();
    return () => {
    };
  }, []);

  const successModalContent = (
    <Modal isOpen={successModal} toggle={() => setSuccessModal(false)}>
      <ModalHeader toggle={() => setSuccessModal(false)}>Success</ModalHeader>
      <ModalBody>Batch Successfully Created</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => setSuccessModal(false)}>Close</Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="name">Batch Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="startDate">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="wineId">Wine</Label>
              <Input
                type="select"
                id="wineId"
                value={wineId}
                onChange={(e) => setWineId(e.target.value)}
              >
                <option value="">Select Wine</option>
                {wines.map((wine) => (
                  <option key={wine.id} value={wine.id}>{wine.name}</option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="estimatedCompletionTime">Estimated Completion Time</Label>
              <Input
                type="datetime-local"
                id="estimatedCompletionTime"
                value={estimatedCompletionTime}
                onChange={(e) => setEstimatedCompletionTime(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="status">Status</Label>
              <Input
                type="select"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="d-flex justify-content-end">
          <Button type="submit" color="primary" className="mx-4">Create Batch</Button>
          <Button color="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      </Form>
      {successModalContent}
    </Container>
  );
}

export default BatchCreationForm;
