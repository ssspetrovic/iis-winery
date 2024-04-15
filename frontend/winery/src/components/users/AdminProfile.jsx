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

const AdminProfile = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const { auth } = useAuth();
  const { username, role } = auth || {};
  const { logout } = useContext(AuthProvider);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await axios.get(`/admins/${username}/`, {
          headers: { "Content-Type": "application/json" },
        });
        const data = response.data;
        setNewUsername(username);
        setAdminInfo(data);
        setEmail(data.email);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPassword(data.password);
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };

    fetchAdminInfo();
  }, []);

  const handleEdit = async () => {
    try {
      console.log("Saving changes...");
      // Enkodiranje šifre pre slanja
      await axios.patch(`/admins/${username}/`, {
        headers: { "Content-Type": "application/json" },
        email: email,
        first_name: firstName,
        last_name: lastName,
        username: newUsername,
        password: password,
      });

      if (newUsername !== username) {
        // Ako jeste, izvrši navigaciju na odgovarajuću adresu
        logout(newUsername); // Logout with the new username
        window.location.href = `/admin-profile/${newUsername}`;
      }
      console.log("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <Container className="admin-container">
      <div className="whitespace">.</div>
      <Row>
        <Col className="text-center">
          <h1>Hi, {username}!</h1>
          <h2>What would you like to do today?</h2>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          {adminInfo && (
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
                      type="username"
                      name="username"
                      id="editUsername"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
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
            </Form>
          )}
        </Col>
      </Row>
      <Row className="mt-5" style={{ marginBottom: "100px" }}>
        <Col className="text-center">
          <button
            color="primary"
            size="lg"
            className="admin-button"
            onClick={handleEdit}
          >
            Edit
          </button>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col className="d-flex flex-column align-items-center">
          <span style={{ color: "black", fontWeight: "bold" }}>View Users</span>
          <Link
            to="/view-users"
            className="btn btn-outline-dark"
            style={{ borderWidth: "3px", borderRadius: "20px" }}
          >
            <i className="fas fa-users fa-6x mb-2"></i>
          </Link>
        </Col>

        <Col className="d-flex flex-column align-items-center">
          <span style={{ color: "black", fontWeight: "bold" }}>
            View Reports
          </span>
          <Link
            to="/view-reports"
            className="btn btn-outline-dark"
            style={{ borderWidth: "3px", borderRadius: "20px" }}
          >
            <i className="fas fa-chart-bar fa-6x mb-2"></i>
          </Link>
        </Col>
        <Col className="d-flex flex-column align-items-center">
          <span style={{ color: "black", fontWeight: "bold" }}>
            View Vehicles
          </span>
          <Link
            to="/view-vehicles"
            className="btn btn-outline-dark"
            style={{ borderWidth: "3px", borderRadius: "20px" }}
          >
            <i className="fas fa-truck fa-6x mb-2"></i>
          </Link>
        </Col>
      </Row>
      <div className="whitespace">.</div>
    </Container>
  );
};

export default AdminProfile;
