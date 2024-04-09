import React, { useState, useEffect } from "react";
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
import axios from "axios";

const AdminProfile = () => {
  const [username, setUsername] = useState("");
  const [adminInfo, setAdminInfo] = useState(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    const fetchAdminInfo = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/admins/${storedUsername}`
        );
        const data = response.data;
        setAdminInfo(data);
        setEmail(data.email);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPassword(data.password);
        // Ne postavljamo šifru ovde, jer ćemo je enkodirati pri čuvanju promena
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
      await axios.patch(`http://127.0.0.1:8000/api/admins/${username}/`, {
        email: email,
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
      });
      if (localStorage.getItem("username") !== username) {
        // Ako jeste, izvrši navigaciju na odgovarajuću adresu
        localStorage.setItem("username", username);
        window.location.href = `/admin-profile/${username}`;
      }
      console.log("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Hi, {username}!</h1>
          <h2>What would you like to do today?</h2>
        </Col>
      </Row>
      <Row>
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
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
      <Row className="mt-4">
        <Col>
          <Button color="primary" onClick={handleEdit}>
            Edit
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Link to="/view-users">
            <Button color="info">View Users</Button>
          </Link>
        </Col>
        <Col>
          <Link to="/view-reports">
            <Button color="success">View Reports</Button>
          </Link>
        </Col>
        <Col>
          <Link to="/view-vehicles">
            <Button color="warning">View Vehicles</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminProfile;
