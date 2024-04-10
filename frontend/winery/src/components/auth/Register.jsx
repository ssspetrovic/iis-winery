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
import "../../assets/styles.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchPasswords, setMatchPasswords] = useState(false);

  const handleSubmit = () => {
    console.log("Register submit");
  };

  useEffect(() => {
    setMatchPasswords(password === confirmPassword);
    console.log("change");
  }, [password, confirmPassword]);

  return (
    <div className="div-center">
      <Container className="border rounded shadow p-5 mt-5 mx-auto col-lg-6 col-md-6 col-sm-10 col-xs-12 w-100">
        <Form className="registration-form" onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="register-email"
                  name="email"
                  placeholder="email placeholder"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  id="register-username"
                  name="username"
                  placeholder="username placeholder"
                  type="username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
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
                  placeholder="Password"
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
                <Label for="confirm-password">Confirm password</Label>
                <Input
                  id="register-confirm-password"
                  className={`form-control ${
                    !matchPasswords ? "is-invalid" : ""
                  }`}
                  type="password"
                  name="confirm-password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  required
                />
                {!matchPasswords && (
                  <div className="invalid-feedback">
                    Passwords do not match.
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label for="register-address">Address</Label>
            <Input
              id="register-address"
              name="address"
              placeholder="1234 Main St"
              required
            />
          </FormGroup>
          <Row>
            <Col md={8}>
              <FormGroup>
                <Label for="register-city">City</Label>
                <Input id="register-city" name="city" required />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="register-postal-code">Postal Code</Label>
                <Input id="register-postal-code" name="postal-code" required />
              </FormGroup>
            </Col>
          </Row>
          <Button>Sign up</Button>
        </Form>
      </Container>
    </div>
  );
};

export default Register;
