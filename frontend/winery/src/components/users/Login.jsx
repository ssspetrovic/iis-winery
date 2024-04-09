import { useContext, useState } from "react";
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
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import profileRedirects from "./ProfileRedirect";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      username: username,
      password: password,
    };

    try {
      // Dobijanje informacija o korisniku na osnovu korisničkog imena
      const userResponse = await axios.get(`/users/${username}`);
      const userRole = userResponse.data.role;

      // Sada možemo nastaviti sa autentifikacijom
      const response = await axios.post("/token/", user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const accessToken = response?.data?.access;
      setAuth({ username, password, accessToken });
      setSuccess(true);
      setErrorMessage("");
      console.log(response);
    } catch (error) {
      if (!error?.response) {
        setErrorMessage("No server response");
      } else if (error.response?.status === 400) {
        setErrorMessage("Missing username or password");
      } else if (error.response?.status === 401) {
        setErrorMessage("Unauthorized");
      } else {
        setErrorMessage("Login failed");
      }
      console.log(errorMessage);
    }
  };

  const handleClick = () => {
    setUsername("");
    setPassword("");
    setSuccess(false);
    navigate("/login");
  };

  return (
    <>
      {!success ? (
        <div className="div-center">
          <Container className="border rounded shadow p-5 mt-5 mx-auto col-lg-6 col-md-6 col-sm-10 col-xs-12 w-100">
            <Form className="login-form" onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="username">Username</Label>
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
                    <Label for="password">Password</Label>
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
                <Button>Sign up</Button>
              </Row>
            </Form>
          </Container>
        </div>
      ) : (
        <div className="div-center">
          <h2>Successully logged in as {username}</h2>
          <h4>
            Back to <Link onClick={handleClick}>login</Link>
          </h4>
          <h4>
            Back to <Link to="/">home page</Link>
          </h4>
        </div>
      )}
    </>
  );
};

export default Login;
