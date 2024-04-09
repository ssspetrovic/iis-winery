import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // Dobijanje korisničkog imena i uloge iz localStorage
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  return (
    <div className="div-center">
      <h1>Hello from home page!</h1>
      {username && <h2>Logged in as: {username}</h2>}
      {role && <h2>Role: {role}</h2>}
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
