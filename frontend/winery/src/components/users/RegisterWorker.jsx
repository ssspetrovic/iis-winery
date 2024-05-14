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
  ModalFooter,
} from "reactstrap";
import "../../assets/styles.css";
import Unauthorized from "../auth/Unauthorized";
import useAuth from "../../hooks/useAuth";
import "../../assets/adminStyles.css";

function RegisterWorker() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [userRole, setUserRole] = useState("manager");
  const [address, setAddress] = useState("");
  const [street_number, setStreetNo] = useState("");
  const [city, setCity] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { auth } = useAuth();
  const { role } = auth || {};
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Provera obaveznih polja
    if (!username || !password || !confirmPassword) {
      setErrorMessage(
        "Username, password, and confirm password are required fields."
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      if (userRole === "manager") {
        const response = await axios.post("/managers/", {
          username,
          password,
          email,
          first_name,
          last_name,
          phone_number,
        });
        console.log(response.data);
      } else if (userRole === "winemaker") {
        const encodedCity = encodeURIComponent(city);
        const cityResponse = await axios.get(`/cities/${encodedCity}/`);
        const response = await axios.post("/winemakers/", {
          username,
          password,
          email,
          first_name,
          last_name,
          address,
          street_number,
          city: cityResponse.data,
        });
        console.log(response.data);
      }

      // Uspesno registrovanje, resetovanje stanja i prikazivanje modala
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setAddress("");
      setStreetNo("");
      setCity("");
      setPhoneNumber("");
      setErrorMessage("");
      setIsModalOpen(true);
      setIsRegistrationSuccess(true);
    } catch (error) {
      console.error(error);
      // Neuspesno registrovanje, prikazivanje poruke o grešci
      setErrorMessage("Registration failed. Please try again later.");
    }
  };

  const handleCancel = () => {
    navigate("/view-users");
  };

  if (role !== "ADMIN") {
    return <Unauthorized />;
  }

  return (
    <Container className="registration-container">
      <div className="registration-box">
        <h1 className="text-center mb-4" style={{ color: "black" }}>
          Register New Workers
        </h1>
        <Form onSubmit={handleSubmit}>
          <Label style={{ color: "black" }}>Role</Label>
          <Row>
            <Col md={6}>
              <FormGroup check inline>
                <Label check style={{ color: "black" }}>
                  <Input
                    type="radio"
                    name="userRole"
                    value="manager"
                    checked={userRole === "manager"}
                    onChange={() => setUserRole("manager")}
                  />
                  Manager
                </Label>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup check inline>
                <Label check style={{ color: "black" }}>
                  <Input
                    type="radio"
                    name="userRole"
                    value="winemaker"
                    checked={userRole === "winemaker"}
                    onChange={() => setUserRole("winemaker")}
                  />
                  Winemaker
                </Label>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="username" style={{ color: "black" }}>
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="first_name" style={{ color: "black" }}>
                  First Name
                </Label>
                <Input
                  type="text"
                  id="first_name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="password" style={{ color: "black" }}>
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="last_name" style={{ color: "black" }}>
                  Last Name
                </Label>
                <Input
                  type="text"
                  id="last_name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="confirmPassword" style={{ color: "black" }}>
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="email" style={{ color: "black" }}>
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          {userRole === "winemaker" && (
            <div>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="address" style={{ color: "black" }}>
                      Address
                    </Label>
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
                    <Label for="street_number" style={{ color: "black" }}>
                      Street Number
                    </Label>
                    <Input
                      type="text"
                      id="street_number"
                      value={street_number}
                      onChange={(e) => setStreetNo(e.target.value)}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="mx-auto">
                  <FormGroup>
                    <Label for="city" style={{ color: "black" }}>
                      City
                    </Label>
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
            </div>
          )}
          {userRole === "manager" && (
            <FormGroup>
              <Label for="phone_number" style={{ color: "black" }}>
                Phone Number
              </Label>
              <Input
                type="text"
                id="phone_number"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-control"
              />
            </FormGroup>
          )}
          {errorMessage && (
            <p className="error-message" style={{ color: "black" }}>
              {errorMessage}
            </p>
          )}
          <div className="d-flex justify-content-between">
            <Button type="submit" className="admin-button-black">
              Register
            </Button>

            <Button color="secondary" onClick={handleCancel}>
              Cancel Registration
            </Button>
          </div>
        </Form>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
          <ModalHeader style={{ color: "black" }}>
            New Worker Successfully Added!
          </ModalHeader>
          <ModalFooter>
            <Button color="secondary" onClick={() => setIsModalOpen(false)}>
              Add Another User
            </Button>
            <Button color="primary" onClick={() => navigate("/view-users")}>
              View Users
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </Container>
  );
}

export default RegisterWorker;
