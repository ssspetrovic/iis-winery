import React, { useState } from "react";
import axios from "axios";
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
      const cityResponse = await axios.get(
        `http://127.0.0.1:8000/api/cities/${city}/`
      );
      if (!cityResponse.data) {
        setErrorMessage("City does not exist.");
        return;
      }

      // Ako grad postoji, dodaj vozilo
      const response = await axios.post(`http://127.0.0.1:8000/api/vehicles/`, {
        driver_name: driverName,
        capacity: parseInt(capacity),
        address: address,
        street_number: parseInt(streetNumber),
        phone_number: phoneNumber,
        vehicle_type: vehicleType,
        city: cityResponse.data, // Koristi podatke o gradu iz odgovora
      });
      console.log(response.data);

      // Resetovanje stanja i preusmeravanje na određenu rutu
      setDriverName("");
      setCapacity("");
      setAddress("");
      setStreetNumber("");
      setPhoneNumber("");
      setVehicleType("");
      setCity("");
      setErrorMessage("");
      navigate("/view-vehicles");
    } catch (error) {
      console.error(error);
      // Prikazivanje poruke o grešci
      setErrorMessage("Failed to add vehicle. Please try again later.");
    }
  };

  const handleCancel = () => {
    navigate("/view-vehicles");
  };

  return (
    <Container className="registration-container">
      <div className="registration-box">
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
            <Col md={6} className="mx-auto">
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
          <Button type="submit" color="primary" className="mr-2">
            Add Vehicle
          </Button>
          <Button color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default AddVehicle;
