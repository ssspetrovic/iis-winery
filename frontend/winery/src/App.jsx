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
import Layout from "./components/util/Layout";
import RequireAuth from "./components/auth/RequireAuth";
import WinemakerOrdersPage from "./components/orders/WinemakerOrderPage";

function App() {
  const ROLES = {
    ADMIN: "ADMIN",
    WINEMAKER: "WINEMAKER",
    MANAGER: "MANAGER",
    CUSTOMER: "CUSTOMER",
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Unprotected */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* Private */}
        <Route element={<RequireAuth allowedRoles={ROLES.ADMIN} />}>
          <Route path="/admin-profile/:username" element={<AdminProfile />} />
        </Route>

        {/* TODO: Update roles accordingly */}
        <Route path="/view-users" element={<ViewUsers />} />
        <Route path="/register-worker" element={<RegisterWorker />} />
        <Route path="/update-worker" element={<UpdateWorker />} />
        <Route path="/view-vehicles" element={<VehiclesList />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/update-vehicle" element={<UpdateVehicle />} />
        <Route path="/view-reports" element={<ReportList />} />
        <Route path="/winemaker-order-page" element={<WinemakerOrdersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
