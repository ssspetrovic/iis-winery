import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  Container,
  Row,
} from "reactstrap";
import axios from "../../api/axios";

const PasswordResetConfirmForm = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(
          `/password_reset/validate_token/${token}/`
        );
        if (response.data.status !== "OK") {
          throw new Error("Invalid token");
        }
      } catch (error) {
        setErrorMessage("Unsafe password or expired password reset token.");
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("/password_reset/confirm/", {
        token: token,
        password: password,
      });
      setErrorMessage(response.data.detail);
    } catch (error) {
      setErrorMessage("Failed to reset password.");
    }
  };

  return (
    <div className="div-center">
      <Container className="border rounded shadow p-5 mt-5 mx-auto col-lg-6 col-md-6 col-sm-10 col-xs-12 w-100">
        <Row>
          <div className="text-center">
            <h2 className="display-6">Confirm Password Reset</h2>
          </div>
        </Row>
        <Form onSubmit={handleSubmit}>
          <Row className="mt-3">
            <FormGroup>
              <Label for="reset-password">New Password:</Label>
              <Input
                id="reset-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup>
              <Label for="reset-password-confirm">Confirm Password:</Label>
              <Input
                id="reset-password-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormGroup>
          </Row>
          <Row>
            <div className="text-center mt-2">
              <Button className="w-100" color="primary">
                Reset Password
              </Button>
            </div>
          </Row>
        </Form>
        <Row>
          <div
            className="text-center my-2"
            style={{
              color: "red",
            }}
          >
            {errorMessage}
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default PasswordResetConfirmForm;
