import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/auth/Register";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import AdminProfile from "./components/users/AdminProfile";
import ViewUsers from "./components/users/ViewUsers";
import RegisterWorker from "./components/users/RegisterWorker";
import UpdateWorker from "./components/users/UpdateWorker";
import VehiclesList from "./components/vehicles/VehiclesList";
import AddVehicle from "./components/vehicles/AddVehicle";
import UpdateVehicle from "./components/vehicles/UpdateVehicle";
import ReportList from "./components/reports/ReportList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-profile/:username" element={<AdminProfile />} />
        <Route path="/view-users" element={<ViewUsers />} />
        <Route path="/register-worker" element={<RegisterWorker />} />
        <Route path="/update-worker" element={<UpdateWorker />} />
        <Route path="/view-vehicles" element={<VehiclesList />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/update-vehicle" element={<UpdateVehicle />} />
        <Route path="/view-reports" element={<ReportList />} />
      </Routes>
    </Router>
  );
}

export default App;
