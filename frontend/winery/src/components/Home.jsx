import React from "react";
import { Button } from "reactstrap";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { useAxiosPrivate } from "../hooks/useAxiosPrivate";
import profileRedirects from "../components/users/ProfileRedirect";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const { auth, logout } = useAuth();
  const { username, role, accessToken, refreshToken } = auth || {};
  const refresh = useRefreshToken();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [authStatus, setAuthStatus] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await axiosPrivate.get("/hello-auth/");
      console.log(response);
      setAuthStatus(true);
    } catch (error) {
      console.error(error);
      setAuthStatus(false);
    }
  };

  const profilePage = async () => {
    const redirectPath = profileRedirects[role](username);
    navigate(redirectPath);
  };

  return (
    <div className="div-center m-4">
      <div className="text-center my-4">
        <h1>Hello from home page!</h1>
      </div>
      <div className="mx-5">
        <h4>Username: {username ? username : "/"}</h4>
        <h4>Role: {role ? role : "/"}</h4>
        <h4>Access token:</h4>
        <div>
          <textarea
            className="form-control w-100"
            name="accessToken"
            value={accessToken ? accessToken : "/"}
            readOnly
          />
        </div>
        <h4>Refresh token:</h4>
        <div>
          <textarea
            className="form-control w-100"
            name="refreshToken"
            value={refreshToken ? refreshToken : "/"}
            readOnly
          />
        </div>
      </div>
      <div className="container m-4 ">
        <Button
          className="w-100"
          style={{ margin: "5px" }}
          onClick={() => profilePage()}
        >
          Redirect to Profile Page
        </Button>
        <Button
          className="w-100"
          style={{ margin: "5px" }}
          onClick={() => navigate("/login")}
        >
          Log in
        </Button>
        <Button
          className="w-100"
          style={{ margin: "5px" }}
          onClick={() => logout()}
        >
          Log out
        </Button>
        <Button
          className="w-100"
          style={{ margin: "5px" }}
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
        <Button
          className="w-100"
          style={{ margin: "5px" }}
          onClick={() => refresh()}
        >
          Refresh token
        </Button>
        <Button
          className="w-100"
          style={{ margin: "5px" }}
          onClick={() => checkAuth()}
        >
          Check Authentication {authStatus ? "[SUCCESSFUL]" : "[FAILED]"}
        </Button>
      </div>
    </div>
  );
};

export default Home;
