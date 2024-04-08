import { useState } from "react";
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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("Login submit");
  };

  return (
    <div className="div-center">
      <Container className="border rounded shadow p-5 mt-5 mx-auto col-lg-6 col-md-6 col-sm-10 col-xs-12 w-100">
        <Form className="login-form" onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  id="login-username"
                  name="username"
                  placeholder="username placeholder"
                  type="username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="login-password"
                  className="form-control"
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
          </Row>
          <Button>Sign up</Button>
        </Form>
      </Container>
    </div>
  );
};

export default Login;
