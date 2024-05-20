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
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import AuthProvider from "../../context/AuthProvider";
import "../../assets/adminStyles.css";

const ManagerProfile = () => {
  const [managerInfo, setManagerInfo] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const { auth } = useAuth();
  const { username, role } = auth || {};
  const { logoutUsername } = useContext(AuthProvider);

  useEffect(() => {
    fetchManagerInfo();
  }, []);

  const fetchManagerInfo = async () => {
    try {
      const response = await axios.get(`/managers/${username}`);
      const data = response.data;
      setManagerInfo(data);
      setNewUsername(username);
      setEmail(data.email);
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setPhoneNumber(data.phone_number);
    } catch (error) {
      console.error("Error fetching manager info:", error);
    }
  };

  const handleEdit = async () => {
    try {
      if (!password) {
        setPasswordError(true);
        return;
      }

      console.log("Saving changes...");
      console.log(password);
      await axios.patch(`/managers/${username}/`, {
        username: newUsername,
        password: password,
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      });

      // Toggle modal visibility on successful edit
      setModalOpen(true);
      console.log("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleNavigate = () => {
    if (newUsername !== username) {
      logoutUsername(newUsername);
    }
    
    window.location.href = `/manager-profile/${newUsername}`;
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Container>
      <Row>
        <Col md={6}>
          <div className="rounded border p-4 my-5">
            <div className="text-center mb-4">
              <i className="fa-solid fa-circle-user fa-3x"></i>
            </div>
            <h4 className="text-center">Hi, {username}!</h4>
            <div className="mt-3">
              <Form>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="editUsername">Username</Label>
                      <Input
                        type="username"
                        name="username"
                        id="editUsername"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
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
                  <Col md={6}>
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
                </Row>
                <Row>
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
        <Col md={4}>
          <Row>
            <Col>
              <div className="rounded p-4 text-center mb-4">
                <Link to="/events" className="btn btn-outline-dark btn-lg mb-2">
                  <i className="fa-solid fa-champagne-glasses fa-3x"></i>
                  <h5 className="mt-2">Events</h5>
                </Link>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="rounded p-4 text-center">
                <Link
                  to="/view-partners"
                  className="btn btn-outline-dark btn-lg"
                >
                  <i className="fa-solid fa-handshake fa-3x"></i>
                  <h5 className="mt-2">Partnerships</h5>
                </Link>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal isOpen={modalOpen} toggle={handleCloseModal} backdrop="static">
        <ModalHeader>Edit Successful</ModalHeader>
        <ModalBody>
          {newUsername !== username ? (
            <p>
              You changed your username. We will redirect you to your new
              profile page.
            </p>
          ) : (
            <p>Your changes have been successfully saved.</p>
          )}{" "}
          <div className="text-center mt-3">
            <button
              color="primary"
              size="lg"
              className="admin-button"
              onClick={handleNavigate}
            >
              Close
            </button>
          </div>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default ManagerProfile;
