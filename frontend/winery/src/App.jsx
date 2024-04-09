import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/users/Register";
import Home from "./components/Home";
import Login from "./components/users/Login";
import AdminProfile from "./components/users/AdminProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-profile/:username" element={<AdminProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
