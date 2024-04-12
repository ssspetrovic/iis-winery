import axios from "../api/axios";
import useAuth from "./useAuth";
import Cookies from "js-cookie";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const refreshToken = Cookies.get("refresh_token");

  const refresh = async () => {
    const response = await axios.post(
      "/token/refresh/",
      { refresh: refreshToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.access);
      return { ...prev, access: response.data.access };
    });

    return response.data.access;
  };

  return refresh;
};

export default useRefreshToken;
