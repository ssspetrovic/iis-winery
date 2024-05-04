import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
// import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
