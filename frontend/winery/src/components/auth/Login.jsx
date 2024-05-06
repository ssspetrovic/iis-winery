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
import { useNavigate, useLocation, Link } from "react-router-dom";
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

    const result = await login(username, password);
    console.log(`message: ${errorMessage}`);

    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      console.log("success");
      console.log("from", from);
      navigate(from, { replace: true });
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="div-center">
      <Container className="border rounded shadow p-5 mt-5 mx-auto col-lg-6 col-md-6 col-sm-10 col-xs-12 w-100">
        <h1 className="display-6 mb-4 text-center">Login</h1>
        <Form className="login-form" onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
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
            <Col md={12}>
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
              <div className="text-center">
                <small>
                  Forgot your password?{" "}
                  <Link to="/reset-password ">Click here to reset it</Link>
                </small>
              </div>
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
            <div className="text-center ">
              <Button color="dark" className="w-100 p-2 mt-3">
                Sign in
              </Button>
            </div>
            <div className="text-center">
              <p className="mt-2 mb-0">
                Don't have an account?{" "}
                <Link to="/register">Click here to register</Link>
              </p>
            </div>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default Login;
