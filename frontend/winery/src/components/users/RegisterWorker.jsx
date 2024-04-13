import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importovanje useNavigate iz React Router-a
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

function RegisterWorker() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [role, setRole] = useState("manager");
  const [address, setAddress] = useState("");
  const [street_number, setStreetNo] = useState("");
  const [city, setCity] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const navigate = useNavigate(); // Koristimo useNavigate hook za navigaciju
  const [errorMessage, setErrorMessage] = useState(""); // Dodajemo stanje za prikazivanje poruka o greškama

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

    const encodedCity = encodeURIComponent(city);
    const cityResponse = await axios.get(`/cities/${encodedCity}`);

    try {
      if (role === "manager") {
        const response = await axios.post("/managers/", {
          username,
          password,
          email,
          first_name,
          last_name,
          phone_number,
        });
        console.log(response.data);
      } else if (role === "winemaker") {
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

      // Uspesno registrovanje, resetovanje stanja i preusmeravanje na određenu rutu
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
    } catch (error) {
      console.error(error);
      // Neuspesno registrovanje, prikazivanje poruke o grešci
      setErrorMessage("Registration failed. Please try again later.");
    }
  };

  const handleCancel = () => {
    navigate("/view-users");
  };

  return (
    <Container className="registration-container">
      <div className="registration-box">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="username">Username</Label>
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
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="confirmPassword">Confirm Password</Label>
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
                <Label for="email">Email</Label>
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
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="first_name">First Name</Label>
                <Input
                  type="text"
                  id="first_name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="last_name">Last Name</Label>
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
          <FormGroup>
            <Label>Role</Label>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="role"
                  value="manager"
                  checked={role === "manager"}
                  onChange={() => setRole("manager")}
                />
                Manager
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="role"
                  value="winemaker"
                  checked={role === "winemaker"}
                  onChange={() => setRole("winemaker")}
                />
                Winemaker
              </Label>
            </FormGroup>
          </FormGroup>
          {role === "winemaker" && (
            <div>
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
                    <Label for="street_number">Street Number</Label>
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
            </div>
          )}
          {role === "manager" && (
            <FormGroup>
              <Label for="phone_number">Phone Number</Label>
              <Input
                type="text"
                id="phone_number"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-control"
              />
            </FormGroup>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <Button type="submit" color="primary" className="mr-2">
            Register
          </Button>
          <Button color="secondary" onClick={handleCancel}>
            Cancel Registration
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default RegisterWorker;
