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
  ModalFooter
} from "reactstrap";
import "../../assets/styles.css";
import "../../assets/adminStyles.css";

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
  const [isOperational, setIsOperational] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("/vehicles/");
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
      setIsOperational(false);
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
        setIsOperational(selectedVehicleData.is_operational || false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cityResponse = await axios.get(
        `/cities/${encodeURIComponent(cityName)}/`
      );

      const url = `/vehicles/${selectedVehicle}/`;
      const data = {
        driver_name: driverName,
        capacity: capacity,
        address: address,
        street_number: streetNo,
        phone_number: phoneNumber,
        vehicle_type: vehicleType,
        is_operational: isOperational,
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
      setIsOperational(false);
      setErrorMessage("");

      // Refetch vehicles to update the list
      fetchVehicles();

      // Show success modal
      setSuccessModal(true);
    } catch (error) {
      console.error(error);
      setErrorMessage("Update failed. Please try again later.");
    }
  };

  const handleCancel = () => {
    navigate("/view-vehicles");
  };

  const successModalContent = (
    <Modal isOpen={successModal} toggle={() => setSuccessModal(false)}>
      <ModalHeader toggle={() => setSuccessModal(false)}>Success</ModalHeader>
      <ModalBody>
        Vehicle Successfully Updated
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
          Update Existing Vehicle
        </h1>
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
            <Col md={6}>
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
            <Col md={6}>
              <FormGroup>
                <Label for="isOperational">Is Operational</Label>
                <Row>
                  <Col md={6}>
                    <FormGroup check inline>
                      <Label check>
                        <Input
                          type="radio"
                          className="radio-check"
                          name="isOperational"
                          value="true"
                          checked={isOperational === true}
                          onChange={() => setIsOperational(true)}
                        />{" "}
                        True
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup check inline>
                      <Label check>
                        <Input
                          type="radio"
                          className="radio-check"
                          name="isOperational"
                          value="false"
                          checked={isOperational === false}
                          onChange={() => setIsOperational(false)}
                        />{" "}
                        False
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
              </FormGroup>
            </Col>
          </Row>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="d-flex justify-content-between">
            <Button type="submit" color="primary" className="mr-2">
              Update
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

export default UpdateVehicle;
