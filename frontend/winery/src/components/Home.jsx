import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { auth, logout } = useAuth();
  const { username, role, accessToken } = auth || {};

  return (
    <div className="div-center">
      <h1>Hello from home page!</h1>
      <h2>Current username: {username}</h2>
      <h2>Current role: {role}</h2>
      <h2>Current access token:</h2> <p>{accessToken}</p>
      <h4>
        Register: <Link to="/register">click here</Link>
      </h4>
      <h4>
        Login: <Link to="/login">click here</Link>
      </h4>
      <Button onClick={() => logout()}>Log out</Button>
    </div>
  );
};

export default Home;
