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
        <div className="border border-black">
            <div className="bg-secondary nav">
                <h2 className="m-2">Winery</h2>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4" style={{ height: '600px' }}>
                        <div className="rounded border mt-5">
                            <Container className="mt-5">
                                <Row>
                                    <i className="fa-solid fa-circle-user fa-2xl mb-3"></i>
                                </Row>
                                <Row>
                                    <Col xs={12} className="text-center fs-4 fw-bold">
                                        <p className="text-center">{username}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        <h4>First Name:</h4>
                                        <p>{managerInfo?.first_name}</p>
                                    </Col>
                                    <Col xs={6}>
                                        <h4>Last Name:</h4>
                                        <p>{managerInfo?.last_name}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        <h4>Username:</h4>
                                        <p>{managerInfo?.username}</p>
                                    </Col>
                                    <Col xs={6}>
                                        <h4>Password:</h4>
                                        <p>********</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} className="text-center">
                                        <h4>Phone Number:</h4>
                                        <p>{managerInfo?.phone_number}</p>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>
                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                        <div className="row d-flex justify-content-center align-items-center">
                            <div className=" pt-4">
                                <div className="rounded border p-4 text-center">
                                    <i className="fa-solid fa-champagne-glasses fa-3x"></i>
                                </div>
                            </div>
                            <div className="pt-4">
                                <div className="rounded border p-4 text-center">
                                    <i className="fa-solid fa-handshake fa-3x p-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-secondary text-white py-2">
                <Container fluid>
                    <Row>
                        <Col xs={6}>
                            <p className="nav m-0 fw-bold">Winery</p>
                        </Col>
                        <Col xs={6} className="text-right">
                            <p className="m-0">
                                <a href="#" className="text-white m-1">About</a>  <a href="#" className="text-white m-2">Contact</a>  <a href="#" className="text-white m-1">Privacy Policy</a>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
    
    
};

export default ManagerProfile;
