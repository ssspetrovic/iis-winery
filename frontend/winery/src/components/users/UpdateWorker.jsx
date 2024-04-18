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
  ModalFooter,
} from "reactstrap";
import "../../assets/styles.css";
import useAuth from "../../hooks/useAuth";
import Unauthorized from "../auth/Unauthorized";
import "../../assets/adminStyles.css";

function UpdateWorker() {
  const [oldUsername, setOldUsername] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [userRole, setUserRole] = useState("manager");
  const [address, setAddress] = useState("");
  const [street_number, setStreetNo] = useState("");
  const [city, setCity] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { auth } = useAuth();
  const { role } = auth || {};
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/${userRole}s/`);
      setUsers(response.data);
      setPassword(response.data.password);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userRole]);

  useEffect(() => {
    // Reset form fields when selecting a different user
    setUsername("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setAddress("");
    setStreetNo("");
    setCity("");
    setPhoneNumber("");
  }, [userRole]);

  const handleUserSelect = (event) => {
    const selectedUsername = event.target.value;
    setSelectedUser(selectedUsername);

    // Fetch user details based on selected username
    // and populate the form fields
    const selectedUserData = users.find(
      (user) => user.username === selectedUsername
    );
    if (selectedUserData) {
      setOldUsername(selectedUserData.username);
      setUsername(selectedUserData.username);
      setEmail(selectedUserData.email);
      setFirstName(selectedUserData.first_name);
      setLastName(selectedUserData.last_name);
      setAddress(selectedUserData.address || "");
      setStreetNo(selectedUserData.street_number || "");
      if (userRole === "winemaker") setCity(selectedUserData.city.name || "");
      setPhoneNumber(selectedUserData.phone_number || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation checks
    if (!username) {
      setErrorMessage("Username is required.");
      return;
    }

    try {
      if (userRole === "manager") {
        const response = await axios.patch(`/managers/${oldUsername}/`, {
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

        const response = await axios.patch(`/winemakers/${oldUsername}/`, {
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

      // Reset form fields on successful submission
      setUsername("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setAddress("");
      setStreetNo("");
      setCity("");
      setPhoneNumber("");
      setSelectedUser("");
      setErrorMessage("");
      fetchUsers();

      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      setErrorMessage("Update failed. Please try again later.");
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
        <h1 className="text-center mb-5" style={{ color: "#007bff" }}>
          Update Existing Workers
        </h1>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="userRole">Role</Label>
                <Row>
                  <Col md={6}>
                    <FormGroup check inline>
                      <Label check>
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
                      <Label check>
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
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="selectedUser">
                  {userRole === "manager"
                    ? "Select Manager"
                    : "Select Winemaker"}
                </Label>
                <Input
                  type="select"
                  name="selectedUser"
                  id="selectedUser"
                  value={selectedUser}
                  onChange={handleUserSelect}
                >
                  <option key="default" value="">
                    Select User
                  </option>
                  {users.map((user) => (
                    <option key={user.username} value={user.username}>
                      {user.username}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
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
          {userRole === "winemaker" && (
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
                <Col>
                  <FormGroup className="mx-auto">
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
          {userRole === "manager" && (
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
          {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
          <div className="d-flex justify-content-between">
            <Button type="submit" color="primary" className="mr-2">
              Update
            </Button>
            <Button color="secondary" onClick={handleCancel}>
              Cancel Update
            </Button>
          </div>
        </Form>
      </div>
      {/* Modal */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader>Worker Successfully Updated!</ModalHeader>
        <ModalFooter>
          <Button color="secondary" onClick={() => setIsModalOpen(false)}>
            Update Another Worker
          </Button>
          <Button color="primary" onClick={() => navigate("/view-users")}>
            View Users
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

export default UpdateWorker;
