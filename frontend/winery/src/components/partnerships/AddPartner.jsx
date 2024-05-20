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
  ModalFooter,
} from "reactstrap";
import "../../assets/styles.css";
import useAuth from "../../hooks/useAuth";
import Unauthorized from "../auth/Unauthorized";

function AddPartner() {
  const [partnerName, setPartnerName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const { auth } = useAuth();
  const { username, role } = auth || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Provera obaveznih polja
    if (
      !partnerName ||
      !email ||
      !address ||
      !streetNumber ||
      !phoneNumber ||
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

      // Ako grad postoji, dodaj partnera
      const response = await axios.post(`/partnerships/`, {
        name: partnerName,
        email: email,
        phone_number: phoneNumber,
        address: address,
        street_number: parseInt(streetNumber),
        city: cityResponse.data,
        // Koristi podatke o gradu iz odgovora
      });
      console.log(response.data);

      // Resetovanje stanja i prikazivanje modala o uspehu
      setPartnerName("");
      setEmail("");
      setAddress("");
      setStreetNumber("");
      setPhoneNumber("");
      setCity("");
      setErrorMessage("");
      setSuccessModal(true);
    } catch (error) {
      console.error(error);
      // Prikazivanje poruke o grešci
      setErrorMessage("Failed to add partner. Please try again later.");
    }
  };

  const handleCancel = () => {
    navigate('/view-partners/');
  };

  const handleClose = () => {
    setSuccessModal(false);
    navigate('/view-partners/');
  }

  const successModalContent = (
    <Modal isOpen={successModal} toggle={() => setSuccessModal(false)}>
      <ModalHeader toggle={() => setSuccessModal(false)}>Success</ModalHeader>
      <ModalBody>Partner Successfully Added</ModalBody>
      <ModalFooter>
        <Button
          style={{ backgroundColor: "#4a5568" }}
          onClick={handleClose}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <div>
      {" "}
      <div className="admin-background"></div>
      { role === "MANAGER" ? (
        <>
            <Container className="registration-container">
                <div className="registration-box">
                <h1 className="text-center mb-4" style={{ color: "black" }}>
                    Add New Partner
                </h1>
                <Form onSubmit={handleSubmit}>
                    <Row>
                    <Col md={6}>
                        <FormGroup>
                        <Label for="partnerName">Partner Name</Label>
                        <Input
                            type="text"
                            id="partnerName"
                            value={partnerName}
                            onChange={(e) => setPartnerName(e.target.value)}
                            className="form-control"
                        />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    </Row>
                    <Row>
                    <Col className="mx-auto">
                        <FormGroup>
                        <Label for="city">City name</Label>
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
                    <Button
                        type="submit"
                        color="primary"
                        className="mr-2 admin-button-black"
                    >
                        Add Partner
                    </Button>
                    <Button color="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    </div>
                </Form>
                </div>
                {successModalContent}
            </Container>
        </>
      ) : (
        <Unauthorized/>
      )}
    </div>
  );
}

export default AddPartner;
