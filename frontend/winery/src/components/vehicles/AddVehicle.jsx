import React, { useState } from "react";
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
  ModalFooter
} from "reactstrap";
import "../../assets/styles.css";

function AddVehicle() {
  const [driverName, setDriverName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [address, setAddress] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Provera obaveznih polja
    if (
      !driverName ||
      !capacity ||
      !address ||
      !streetNumber ||
      !phoneNumber ||
      !vehicleType ||
      !city
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      // Provera postoji li grad u bazi podataka
      const cityResponse = await axios.get(`/cities/${city}/`);
      if (!cityResponse.data) {
        setErrorMessage("City does not exist.");
        return;
      }

      // Ako grad postoji, dodaj vozilo
      const response = await axios.post(`/vehicles/`, {
        driver_name: driverName,
        capacity: parseInt(capacity),
        address: address,
        street_number: parseInt(streetNumber),
        phone_number: phoneNumber,
        vehicle_type: vehicleType,
        city: cityResponse.data, // Koristi podatke o gradu iz odgovora
      });
      console.log(response.data);

      // Resetovanje stanja i prikazivanje modala o uspehu
      setDriverName("");
      setCapacity("");
      setAddress("");
      setStreetNumber("");
      setPhoneNumber("");
      setVehicleType("");
      setCity("");
      setErrorMessage("");
      setSuccessModal(true);
    } catch (error) {
      console.error(error);
      // Prikazivanje poruke o grešci
      setErrorMessage("Failed to add vehicle. Please try again later.");
    }
  };

  const handleCancel = () => {
    navigate("/view-vehicles");
  };

  const successModalContent = (
    <Modal isOpen={successModal} toggle={() => setSuccessModal(false)}>
      <ModalHeader toggle={() => setSuccessModal(false)}>Success</ModalHeader>
      <ModalBody>
        Vehicle Successfully Added
      </ModalBody>
      <ModalFooter>
        <Button style={{ backgroundColor: "#4a5568" }} onClick={() => setSuccessModal(false)}>Close</Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <Container className="registration-container">
      <div className="registration-box">
        <h1 className="text-center mb-4" style={{ color: "#007bff" }}>
          Add New Vehicle
        </h1>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="driverName">Driver Name</Label>
                <Input
                  type="text"
                  id="driverName"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="capacity">Capacity</Label>
                <Input
                  type="number"
                  id="capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="streetNumber">Street Number</Label>
                <Input
                  type="number"
                  id="streetNumber"
                  value={streetNumber}
                  onChange={(e) => setStreetNumber(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="phoneNumber">Phone Number</Label>
                <Input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="vehicleType">Vehicle Type</Label>
                <Input
                  type="select"
                  id="vehicleType"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="scooter">Scooter</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="bicycle">Bicycle</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="mx-auto">
              <FormGroup>
                <Label for="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="d-flex justify-content-between">
            <Button type="submit" color="primary" className="mr-2">
              Add Vehicle
            </Button>
            <Button color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
      {successModalContent}
    </Container>
  );
}

export default AddVehicle;
