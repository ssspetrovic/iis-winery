import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import "@fortawesome/fontawesome-free/css/all.css";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import AuthProvider from "../../context/AuthProvider";
import "../../assets/adminStyles.css";

const WinemakerProfile = () => {
  const [winemkerInfo, setWinemakerInfo] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityPostalCode, setCityPostalCode] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    fetchWinemakerInfo();
  }, []);

  const fetchWinemakerInfo = async () => {
    try {
      const response = await axios.get(`/winemakers/${username}`);
      const data = response.data[0];
      setWinemakerInfo(data);
      setEmail(data.email);
      setUsername(data.username)
      setPassword(data.password)
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setPhoneNumber(data.phone_number);
      setAddress(data.address)
      setStreetNumber(data.street_number)
      setCityName(data.city.name)
      setCityPostalCode(data.city.postal_code)
    } catch (error) {
      console.error("Error fetching manager info:", error);
    }
  };

  const handleEdit = async () => {
    try {
      if (!password) {
        setPasswordError(true);
        return; // Exit early if password is empty
      }

      console.log("Saving changes...");
      console.log(password);
      await axios.patch(`/winemakers/${username}/`, {
        username: username,
        password: password,
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        address: address,
        street_number: streetNumber,
        city: {
          name: cityName,
          postal_code: postalCode
        }

      });
      console.log("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <Container className="justify-content-center">
      <Row>
        <Col md={6}>
          <div className="rounded border p-4 my-5">
            <div className="text-center mb-4">
              <i className="fa-solid fa-circle-user fa-3x"></i>
            </div>
            <h4 className="text-center">{username}</h4>
            <div className="mt-3">
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="editFirstName">First Name</Label>
                      <Input
                        type="text"
                        name="firstName"
                        id="editFirstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="editLastName">Last Name</Label>
                      <Input
                        type="text"
                        name="lastName"
                        id="editLastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                <Col md={6}>
                    <FormGroup>
                      <Label for="editUsername">Username</Label>
                      <Input
                        type="text"
                        name="username"
                        id="editUsername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="editPassword">Password</Label>
                      <Input
                        type="password"
                        name="password"
                        id="editPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                <Col>
                    <FormGroup>
                      <Label for="editEmail">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        id="editEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="editPhoneNumber">Phone Number</Label>
                      <Input
                        type="text"
                        name="phoneNumber"
                        id="editPhoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="editStreetAddress">Street Address</Label>
                      <Input
                        type="text"
                        name="streetAddress"
                        id="editStreetAddress"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="editStreetNumber">Street Number</Label>
                      <Input
                        type="number"
                        name="streetNumber"
                        id="editStreetNumber"
                        value={streetNumber}
                        onChange={(e) => setStreetNumber(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
              {/* Conditional rendering for password error message */}
              {passwordError && (
                <p className="text-danger">Please enter a password.</p>
              )}
              <div className="text-center">
                <button
                  className="admin-button"
                  onClick={handleEdit}
                  style={{ height: "50px" }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default WinemakerProfile;