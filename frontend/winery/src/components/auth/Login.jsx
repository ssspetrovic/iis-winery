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
import { Link, useNavigate, useLocation } from "react-router-dom";
import profileRedirects from "../users/ProfileRedirect";
import useAuth from "../../hooks/useAuth";
import { useCookies } from "react-cookie";

const Login = () => {
  const { login } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Dobijanje informacija o korisniku na osnovu korisničkog imena
      // const userResponse = await axios.get(`/users/${username}`);
      // const userRole = userResponse.data.role;

      // Sada možemo nastaviti sa autentifikacijom
      const success = await login(username, password);
      console.log(success);
      if (success) {
        console.log("in");
        console.log("from", from);
        navigate(from, { replace: true });
      }

      // // localStorage.setItem("username", username);
      // // localStorage.setItem("role", userRole);
      // const accessToken = response?.data?.access;
      // const refreshToken = response?.data?.refresh;
      // console.log(username);
      // console.log(accessToken);
      // const role = "admin";
      // setAuth({ username, role, accessToken, refreshToken });

      // setCookie("username", username, { path: "/" });
      // setCookie("role", role, { path: "/" });
      // setCookie("access_token", accessToken, { path: "/" });
      // setCookie("refresh_token", refreshToken, { path: "/" });

      setErrorMessage("");
      // on successful login, the user is routed to the page he was trying to visit while unauthenticated
      navigate(from, { replace: true });
      // Redirekcija na odgovarajući profil
      // const redirectPath = profileRedirects[userRole](username);
      // navigate(redirectPath);
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
            <Button>Sign up</Button>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default Login;
