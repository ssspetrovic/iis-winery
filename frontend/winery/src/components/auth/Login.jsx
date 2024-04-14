import { useEffect, useState } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Checks where the user was trying to go to when he tried to login
  let from = location.state?.from?.pathname;
  if (!from || from === "/login") {
    from = "/";
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // If the double alert pop is annoying, comment out the <React.StrictMode> in index.jsx
    if (auth?.username) {
      alert("You are already logged in!");
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(await login(username, password));
    if (errorMessage === "") {
      console.log("success");
      console.log("from", from);
      navigate(from, { replace: true });
      setErrorMessage("");
    }
    // On successful login, the user is routed to the page he was trying to visit while unauthenticated
    navigate(from, { replace: true });
  };

  return (
    <div className="div-center">
      <Container className="border rounded shadow p-5 mt-5 mx-auto col-lg-6 col-md-6 col-sm-10 col-xs-12 w-100">
        <Form className="login-form" onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="login-username">Username</Label>
                <Input
                  id="login-username"
                  className="form-control"
                  name="username"
                  placeholder="Enter your username"
                  type="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="login-password">Password</Label>
                <Input
                  id="login-password"
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
          <Row>
            <Button>Sign in</Button>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default Login;
