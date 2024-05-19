import React, { useState, useEffect, useContext } from "react";
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
  ModalFooter,
} from "reactstrap";
import "@fortawesome/fontawesome-free/css/all.css";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import AuthProvider from "../../context/AuthProvider";
import "../../assets/adminStyles.css";
import AdminProfileCarousel from "../util/AdminProfileCarousel";

const AdminProfile = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { auth } = useAuth();
  const { username, role } = auth || {};
  const { logoutUsername } = useContext(AuthProvider);

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
      console.log(newUsername, username);
      console.log("Saving changes...");
      await axios.patch(`/admins/${username}/`, {
        headers: { "Content-Type": "application/json" },
        email: email,
        first_name: firstName,
        last_name: lastName,
        username: newUsername,
        password: password,
      });

      console.log("Changes saved successfully!");
      setModalOpen(false);
      handleNavigate();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleNavigate = () => {
    if (newUsername !== username) {
      logoutUsername(newUsername);
    }

    window.location.href = `/admin-profile/${newUsername}`;
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setModalOpen(false);
  };

  return (
    <Container className="admin-container">
      <div className="whitespace">.</div>
      <Row>
        <Col className="text-center">
          <h1>
            Hi, {username}! <span>&nbsp;</span>
            <i
              className="fas fa-cog admin-cog-icon"
              onClick={() => setModalOpen(true)}
            ></i>
          </h1>

          <h2>What would you like to do today? </h2>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <AdminProfileCarousel username={username} />
        </Col>
      </Row>

      <div className="whitespace">.</div>

      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        backdrop="static"
      >
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalBody>
          <Form>
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
          </Form>
        </ModalBody>
        <ModalFooter className="admin-modal-footer-buttons">
          <button className="admin-button" onClick={handleEdit}>
            Save
          </button>
          <button className="admin-button" onClick={() => setModalOpen(false)}>
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default AdminProfile;
