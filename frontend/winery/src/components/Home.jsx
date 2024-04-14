import React from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col } from "reactstrap";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
import profileRedirects from "../components/users/ProfileRedirect";
import { useNavigate, useLocation } from "react-router-dom";

const Home = () => {
  const { auth, logout } = useAuth();
  const { username, role, accessToken, refreshToken } = auth || {};
  const refresh = useRefreshToken();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await axiosPrivate.get("/hello-auth/");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const profilePage = async () => {
    const redirectPath = profileRedirects[role](username);
    navigate(redirectPath);
  };

  return (
    <div className="div-center">
      <h1>Hello from home page!</h1>
      <h3>Username: {username}</h3>
      <h3>Role: {role}</h3>
      <h3>Access token:</h3> <p>{accessToken}</p>
      <h3>Refresh token:</h3> <p>{refreshToken}</p>
      <h4>
        Register: <Link to="/register">click here</Link>
      </h4>
      <h4>
        Login: <Link to="/login">click here</Link>
      </h4>
      <Button style={{ margin: "5px" }} onClick={() => logout()}>
        Log out
      </Button>
      <Button style={{ margin: "5px" }} onClick={() => refresh()}>
        Refresh token
      </Button>
      <Row style={{ margin: "10px" }}>
        <Col>
          <Button onClick={() => checkAuth()}>Check Authentication</Button>
          <Button onClick={() => profilePage()}>
            Redirect to Profile Page
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
