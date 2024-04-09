import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const Home = () => {
  return (
    <div className="div-center">
      <h1>Hello from home page!</h1>
      <h4>
        Register: <Link to="/register">click here</Link>
      </h4>
      <h4>
        Login: <Link to="/login">click here</Link>
      </h4>
    </div>
  );
};

export default Home;
