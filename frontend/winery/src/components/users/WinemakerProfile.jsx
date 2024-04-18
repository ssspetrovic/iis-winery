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
  const [newUsername, setNewUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityPostalCode, setCityPostalCode] = useState('');
  const [editMode, setEditMode] = useState(false);
  const { logoutUsername } = useContext(AuthProvider);
  const { auth } = useAuth();
  const { username, role } = auth || {};

  useEffect(() => {
    fetchWinemakerInfo();
  }, []);

  const fetchWinemakerInfo = async () => {
    try {
        const response = await axios.get(`/winemakers/${username}/`, {
            headers: { "Content-Type": "application/json" },
          });
      const data = response.data;
      setEmail(data.email);
      setNewUsername(data.username)
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setPhoneNumber('+38166542213');
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
      console.log("Saving changes...");
      const response = await axios.patch(`/winemakers/${username}/`, {
        first_name: firstName,
        last_name: lastName,
        username: newUsername,
        phone_number: phoneNumber,
        address: address,
        street_number: streetNumber,
        city: {
          name: cityName,
          postal_code: cityPostalCode
        }

      });

      if (newUsername !== username) {
        // Ako jeste, izvrši navigaciju na odgovarajuću adresu
        logoutUsername(newUsername); // Logout with the new username
        window.location.href = `/winemaker-profile/${newUsername}`;
      }
      console.log(response);
      alert("Information successfully updated!");
      setEditMode(false);
    } catch (error) {
      console.log(error);
      alert("Failed to update the information :(\nPlease try again.");
    }
  };

  return (
    <Container className="admin-container">
      <Row>
        <Col md={6}>
          <div className="rounded border p-4 my-5">
            <div className="text-center mb-4">
              <i className="fa-solid fa-circle-user fa-3x"></i>
            </div>
            <h4 className="text-center">{username}</h4>
            <div className="mt-3">
              <Form>
                <Row className="mt-4">
                  <Col md={6}>
                    <FormGroup>
                      <Label for="editFirstName">First Name</Label>
                      <Input
                        type="text"
                        name="firstName"
                        id="editFirstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={!editMode}
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
                        disabled={!editMode}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                <Col>
                    <FormGroup>
                      <Label for="editUsername">Username</Label>
                      <Input
                        type="text"
                        name="username"
                        id="editUsername"
                        value={newUsername} // Use newUsername state here
                        onChange={(e) => setNewUsername(e.target.value)}
                        disabled={!editMode}
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
                        disabled={!editMode}
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
                        disabled={!editMode}
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
                        disabled={!editMode}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="editCity">City</Label>
                      <Input
                        type="text"
                        name="city"
                        id="editCity"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        disabled={!editMode}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="editPostalCode">Postal Code</Label>
                      <Input
                        type="number"
                        name="postalCode"
                        id="editPostalCode"
                        value={cityPostalCode}
                        onChange={(e) => setCityPostalCode(e.target.value)}
                        disabled={!editMode}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
              <div className="text-center">
                {editMode ? ( // Render buttons based on edit mode
                  <>
                    <button
                      className="admin-button"
                      onClick={handleEdit}
                      style={{ height: "50px" }}
                    >
                      Save Changes
                    </button>
                    <button
                      className="admin-button"
                      onClick={() => setEditMode(false)}
                      style={{ height: "50px", marginLeft: "10px", color: "red" }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="admin-button"
                    onClick={() => setEditMode(true)}
                    style={{ height: "50px" }}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default WinemakerProfile;