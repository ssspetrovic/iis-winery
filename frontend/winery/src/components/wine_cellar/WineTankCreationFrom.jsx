import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
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

function AddWineTank({wineRoomId, toggleModal, fetchWineTanks}) {
  const [tankName, setTankName] = useState("");
  const [description, setDescription] = useState("");
  const [wineType, setWineType] = useState("");
  const [tankType, setTankType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [currentVolume, setCurrentVolume] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [wines, setWines] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tankName || !description || !wineType || !tankType || !capacity || !currentVolume) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (parseInt(currentVolume) > parseInt(capacity)) {
      setErrorMessage("Current volume must be smaller than capacity!");
      return;
    }

    try {
      const response = await axios.post(`/wine-tanks/`, {
        tank_id: tankName,
        description: description,
        wine: wineType,
        room: wineRoomId,
        tank_type: tankType,
        capacity: parseInt(capacity),
        current_volume: parseInt(currentVolume),
      });

      setTankName("");
      setDescription("");
      setWineType("");
      setTankType("");
      setCapacity("");
      setCurrentVolume("");
      setErrorMessage("");
      setSuccessModal(true);
      fetchWineTanks(); 
      toggleModal();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to add wine tank. Please try again later.");
    }
  };

  const onCancel = () => {
    toggleModal();
  } 

  const fetchWine = async () => {
    try {
      const response = await axios.get(`/wines/`);
      setWines(response.data);
    } catch (error) {
      console.error("Error fetching wines:", error);
    }
  };

  useEffect(() => {
    fetchWine();
    return () => {
    };
  }, []);

  const successModalContent = (
    <Modal isOpen={successModal} toggle={() => setSuccessModal(false)}>
      <ModalHeader toggle={() => setSuccessModal(false)}>Success</ModalHeader>
      <ModalBody>Wine Tank Successfully Added</ModalBody>
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
              <Label for="tankName">Tank Name</Label>
              <Input
                type="text"
                id="tankName"
                value={tankName}
                onChange={(e) => setTankName(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="wineType">Wine Type</Label>
              <Input
                type="select"
                id="wineType"
                value={wineType}
                onChange={(e) => setWineType(e.target.value)}
              >
                <option value="">Select Wine Type</option>
                {wines.map((wine) => (
                <option key={wine.id} value={wine.name}>{wine.name}</option>
                ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="tankType">Tank Type</Label>
              <Input
                type="select"
                id="tankType"
                value={tankType}
                onChange={(e) => setTankType(e.target.value)}
              >
                <option value="">Select Tank Type</option>
                <option value="Inox">Inox</option>
                <option value="Barrel">Barrel</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="capacity">Capacity</Label>
              <Input
                type="number"
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="currentVolume">Current Volume</Label>
              <Input
                type="number"
                id="currentVolume"
                value={currentVolume}
                onChange={(e) => setCurrentVolume(e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="d-flex justify-content-end">
          <Button type="submit" color="primary" className="mx-4">Add Wine Tank</Button>
          <Button color="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      </Form>
      {successModalContent}
    </Container>
  );
}

export default AddWineTank;
