import { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "username",
    "role",
    "access_token",
    "refresh_token",
  ]);

  const [auth, setAuth] = useState({
    username: cookies.username || "",
    role: cookies.role || "",
    accessToken: cookies.access_token || "",
    refreshToken: cookies.refresh_token || "",
  });

  useEffect(() => {
    setAuth({
      username: cookies.username || "",
      role: cookies.role || "",
      accessToken: cookies.access_token || "",
      refreshToken: cookies.refresh_token || "",
    });
  }, []);

  const getRole = async (username) => {
    try {
      const response = await axios.get(`${username}/role/`);
      return response.data.role;
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (username, password) => {
    const user = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post("/token/", user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const accessToken = response?.data?.access;
      const refreshToken = response?.data?.refresh;
      const role = await getRole(username);
      console.log(role);

      setAuth({ username, role, accessToken, refreshToken });

      setCookie("username", username, { path: "/" });
      setCookie("role", role, { path: "/" });
      setCookie("access_token", accessToken, { path: "/" });
      setCookie("refresh_token", refreshToken, { path: "/" });

      return "";
    } catch (error) {
      let errorMessage = "";

      if (!error?.response) {
        errorMessage = "No server response";
      } else if (error.response?.status === 400) {
        errorMessage = "Missing username or password";
      } else if (error.response?.status === 401) {
        errorMessage = "Wrong username or password";
      } else {
        errorMessage = "Login failed";
      }

      console.error(error);
      return errorMessage;
    }
  };

  const logoutUsername = (newUsername = "") => {
    if (newUsername) {
      removeCookie("username");
      setCookie("username", newUsername, { path: "/" });
    }
    setAuth({});
  };

  const logout = () => {
    removeCookie("username");
    removeCookie("role");
    removeCookie("access_token");
    removeCookie("refresh_token");
    setAuth({});
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, login, logout, logoutUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
