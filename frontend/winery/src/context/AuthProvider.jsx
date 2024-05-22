import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "../api/axios";
import { ROLES } from "../components/auth/Roles";
import PropTypes from "prop-types";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies([
    "username",
    "role",
    "access_token",
    "refresh_token",
    "cart_id",
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

      if (role == ROLES.CUSTOMER) {
        const customerResponse = await axios.get("/customers/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const customer = customerResponse.data.find(
          (customer) => customer.username === username
        );
        const customerId = customer ? customer.id : null;

        const cartResponse = await axios.get("/carts/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const userCart = cartResponse.data.find(
          (cart) => cart.customer === customerId
        );

        if (userCart) {
          setCookie("cart_id", userCart.id, { path: "/" });
          console.log("FOUND ID:", userCart.id);
        } else {
          console.log("No matching cart found for user:", username);
        }
      }

      return { success: true, message: "" };
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
      return { success: false, message: errorMessage };
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
    setTimeout(() => navigate("/"), 0);
  };

  const register = async (user) => {
    try {
      const response = await axios.post("/customers/", user, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response);
      return { success: true, message: "" };
    } catch (error) {
      let errorMessage = "";

      if (!error?.response) {
        errorMessage = "No server response";
      } else if (error.response?.status === 400) {
        if (error.response.data.username) {
          errorMessage = "Username already exists";
        } else if (error.response.data.email) {
          errorMessage = "Email already exists";
        } else {
          errorMessage = "Registration failed";
        }
      } else {
        errorMessage = "Registration failed";
      }

      console.log(error);
      return { success: false, message: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, login, logout, register, logoutUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
