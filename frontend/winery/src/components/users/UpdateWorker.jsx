import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "reactstrap";
import "../../assets/styles.css";

function UpdateWorker() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [role, setRole] = useState("manager");
  const [address, setAddress] = useState("");
  const [streetNo, setStreetNo] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/${role}s/`);
      setUsers(response.data);
      setPassword(response.data.password);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  useEffect(() => {
    // Resetovanje polja forme kada se izabere drugi korisnik
    setUsername("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setAddress("");
    setStreetNo("");
    setCity("");
    setZip("");
    setCountry("");
    setPhoneNumber("");
  }, [role]);

  const handleUserSelect = (event) => {
    const selectedUsername = event.target.value;
    setSelectedUser(selectedUsername);

    // Fetch user details based on selected username
    // and populate the form fields
    const selectedUserData = users.find(
      (user) => user.username === selectedUsername
    );
    if (selectedUserData) {
      setUsername(selectedUserData.username);
      setEmail(selectedUserData.email);
      setFirstName(selectedUserData.first_name);
      setLastName(selectedUserData.last_name);
      setAddress(selectedUserData.address || "");
      setStreetNo(selectedUserData.streetNo || "");
      setCity(selectedUserData.city || "");
      setZip(selectedUserData.zip || "");
      setCountry(selectedUserData.country || "");
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
      let url = "";
      let data = {};
      if (role === "manager") {
        url = `/managers/${username}/`;
        data = {
          username,
          password,
          email,
          first_name,
          last_name,
          phone_number,
        };
      } else if (role === "winemaker") {
        url = `/winemakers/${username}/`;
        data = {
          username,
          password,
          email,
          first_name,
          last_name,
          address,
          streetNo,
          city,
          zip,
          country,
        };
      }

      const response = await axios.patch(url, data);
      console.log(response.data);
      // Reset form fields on successful submission
      setUsername("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setAddress("");
      setStreetNo("");
      setCity("");
      setZip("");
      setCountry("");
      setPhoneNumber("");
      setSelectedUser("");
      setErrorMessage("");

      // Refetch users to update the list
      fetchUsers();
    } catch (error) {
      console.error(error);
      setErrorMessage("Update failed. Please try again later.");
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
                <Label for="role">Role</Label>
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
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="selectedUser">
                  {role === "manager" ? "Select Manager" : "Select Winemaker"}
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
                <Col md={6}>
                  <FormGroup>
                    <Label for="zip">Zip</Label>
                    <Input
                      type="text"
                      id="zip"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="country">Country</Label>
                    <Input
                      type="text"
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
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
          )}{" "}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <Button type="submit" color="primary" className="mr-2">
            Update
          </Button>
          <Button color="secondary" onClick={handleCancel}>
            Cancel Update
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default UpdateWorker;
