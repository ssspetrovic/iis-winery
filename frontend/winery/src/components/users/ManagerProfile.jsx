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

const ManagerProfile = () => {
    const [managerInfo, setManagerInfo] = useState(null);
    const { auth } = useAuth();
    const { username, role } = auth || {};
    const { logout } = useContext(AuthProvider);

    useEffect(() => {
        fetchManagerInfo();
    }, []);

    const fetchManagerInfo = async () => {
        try {
            const response = await axios.get(`/managers/${username}`);
            setManagerInfo(response.data);
        } catch (error) {
            console.error('Error fetching manager info:', error);
        }
    };

    return (
        <div>
          <h2>Manager Information</h2>
          {managerInfo ? (
            <div>
              <p>First Name: {managerInfo.first_name}</p>
              <p>Last Name: {managerInfo.last_name}</p>
              <p>Username: {managerInfo.username}</p>
              <p>Phone Number: {managerInfo.phone_number}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      );
};

export default ManagerProfile;
