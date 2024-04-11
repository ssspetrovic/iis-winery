import React, { useState, useEffect } from "react";
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

function UpdateVehicle() {
  const [driverName, setDriverName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [address, setAddress] = useState("");
  const [streetNo, setStreetNo] = useState("");
  const [cityName, setCityName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/vehicles/");
      setVehicles(response.data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to fetch vehicles.");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleVehicleSelect = (event) => {
    const selectedId = event.target.value;
    setSelectedVehicle(selectedId);

    if (selectedId === "") {
      // Reset all fields if "Select Vehicle" is chosen
      setDriverName("");
      setCapacity("");
      setAddress("");
      setStreetNo("");
      setCityName("");
      setPhoneNumber("");
      setVehicleType("");
    } else {
      // Fetch vehicle details based on selected ID
      // and populate the form fields
      const selectedVehicleData = vehicles.find(
        (vehicle) => vehicle.id === parseInt(selectedId)
      );
      if (selectedVehicleData) {
        setDriverName(selectedVehicleData.driver_name || "");
        setCapacity(selectedVehicleData.capacity || "");
        setAddress(selectedVehicleData.address || "");
        setStreetNo(selectedVehicleData.street_number || "");
        setCityName(selectedVehicleData.city.name || "");
        setPhoneNumber(selectedVehicleData.phone_number || "");
        setVehicleType(selectedVehicleData.vehicle_type || "");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cityResponse = await axios.get(
        `http://127.0.0.1:8000/api/cities/${encodeURIComponent(cityName)}/`
      );

      const url = `http://127.0.0.1:8000/api/vehicles/${selectedVehicle}/`;
      const data = {
        driver_name: driverName,
        capacity: capacity,
        address: address,
        street_number: streetNo,
        phone_number: phoneNumber,
        vehicle_type: vehicleType,
        city: cityResponse.data,
      };

      const response = await axios.patch(url, data);
      console.log(response.data);

      // Reset form fields on successful submission
      setDriverName("");
      setCapacity("");
      setAddress("");
      setStreetNo("");
      setCityName("");
      setPhoneNumber("");
      setVehicleType("");
      setSelectedVehicle("");
      setErrorMessage("");

      // Refetch vehicles to update the list
      fetchVehicles();
    } catch (error) {
      console.error(error);
      setErrorMessage("Update failed. Please try again later.");
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
            <Col md={6} className="mx-auto">
              <FormGroup>
                <Label for="selectedVehicle">Select Vehicle</Label>
                <Input
                  type="select"
                  name="selectedVehicle"
                  id="selectedVehicle"
                  value={selectedVehicle}
                  onChange={handleVehicleSelect}
                >
                  <option key="default" value="">
                    Select Vehicle
                  </option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.driver_name} - {vehicle.phone_number}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
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
                  type="text"
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
                <Label for="streetNo">Street Number</Label>
                <Input
                  type="text"
                  id="streetNo"
                  value={streetNo}
                  onChange={(e) => setStreetNo(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="cityName">City Name</Label>
                <Input
                  type="text"
                  id="cityName"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
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
          </Row>
          <Row>
            <Col md={6} className="mx-auto">
              <FormGroup>
                <Label for="vehicleType">Vehicle Type</Label>
                <Input
                  type="select"
                  name="vehicleType"
                  id="vehicleType"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="scooter">Scooter</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="bicycle">Bicycle</option>
                  {/* Add more options as needed */}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <Button type="submit" color="primary" className="mr-2">
            Update
          </Button>
          <Button color="secondary" onClick={handleCancel}>
            Cancel Update
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default UpdateVehicle;
