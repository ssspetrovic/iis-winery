import { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ConfirmModal from "../util/ConfirmModal";

const Register = () => {
  const { auth, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the double alert pop is annoying, comment out the <React.StrictMode> in index.jsx
    if (auth?.username) {
      alert("You are already logged in!");
      navigate("/");
    }
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [streetNumber, setStreetNumber] = useState(1);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState(1);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchPasswords, setMatchPasswords] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    header: "",
    body: "",
    func: () => {},
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // 'yyyy-mm-dd' format
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const toggleConfirmModalOpen = () => {
    setIsConfirmModalOpen(!isConfirmModalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userAge = calculateAge(dateOfBirth);

    if (userAge < 18) {
      setErrorMessage("You must be at least 18 years old to register.");
      return;
    }

    const user = {
      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      email: email,
      address: address,
      street_number: streetNumber,
      city: {
        name: city,
        postal_code: postalCode,
      },
    };

    const result = await register(user);
    console.log(result);

    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      console.log("success");
      setModalData({
        header: "Registration Successful",
        body: "Thank you for registering. You can now login with your credentials.",
        func: () => navigate("/login"),
      });
      toggleConfirmModalOpen();
      setErrorMessage(result.message);
    }
  };

  useEffect(() => {
    setMatchPasswords(password === confirmPassword);
    console.log("change");
  }, [password, confirmPassword]);

  return (
    <div className="div-center" style={{ width: "65%" }}>
      <Container className="border rounded shadow p-5 mt-5 mx-auto col-lg-6 col-md-6 col-sm-10 col-xs-12 w-100">
        <h1 className="text-center display-6 mb-4">Register</h1>
        <Form className="registration-form" onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="register-first-name">First name</Label>
                <Input
                  id="register-first-name"
                  name="first-name"
                  placeholder="Enter your first name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="register-last-name">Last name</Label>
                <Input
                  id="register-last-name"
                  name="last-name"
                  placeholder="Enter you last name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="register-email">Email</Label>
                <Input
                  id="register-email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="register-username">Username</Label>
                <Input
                  id="register-username"
                  name="username"
                  placeholder="Enter you username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="register-password"
                  className={`form-control ${
                    !matchPasswords ? "is-invalid" : ""
                  }`}
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="register-confirm-password">Confirm password</Label>
                <Input
                  id="register-confirm-password"
                  className={`form-control ${
                    !matchPasswords ? "is-invalid" : ""
                  }`}
                  type="password"
                  name="confirm-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="register-dob">Birth date</Label>
                <Input
                  id="register-dob"
                  name="date_of_birth"
                  placeholder="Enter your birth date"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(formatDate(e.target.value));
                  }}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={9}>
              <FormGroup>
                <Label for="register-address">Address</Label>
                <Input
                  id="register-address"
                  name="address"
                  placeholder="Enter your address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="register-streetno">Street number</Label>
                <Input
                  id="register-streetno"
                  name="streetno"
                  placeholder="Enter your street no."
                  type="number"
                  value={streetNumber}
                  onChange={(e) => setStreetNumber(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={9}>
              <FormGroup>
                <Label for="register-city">City</Label>
                <Input
                  id="register-city"
                  name="city"
                  placeholder="Enter your address"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label for="register-postal-code">Postal Code</Label>
                <Input
                  id="register-postal-code"
                  name="postal-code"
                  placeholder="Enter your postal code"
                  type="number"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <div
              style={{
                textAlign: "center",
                marginBottom: "10px",
                color: "red",
              }}
            >
              {errorMessage}
            </div>
          </Row>
          <Row className="mt-2">
            <div className="text-center ">
              <Button color="dark" className="w-100 p-2">
                Sign up
              </Button>
            </div>
            <div className="text-center">
              <p className="my-2">
                Already have an account?{" "}
                <Link to="/login">Click here to login</Link>
              </p>
            </div>
          </Row>
        </Form>
      </Container>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        toggle={toggleConfirmModalOpen}
        data={modalData}
      />
    </div>
  );
};

export default Register;
