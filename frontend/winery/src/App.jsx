import { Routes, Route } from "react-router-dom";
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
import Unauthorized from "./components/auth/Unauthorized";
import NotFound from "./components/util/NotFound";
import MainNavbar from "./components/util/MainNavbar";
import ManagerProfile from "./components/users/ManagerProfile";
import CustomerProfile from "./components/users/CustomerProfile";
import { ROLES } from "./components/auth/Roles";
import "./index.css";
import "./assets/styles.css";

function App() {
  return (
    <>
      <MainNavbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Unprotected */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Private */}
          <Route element={<RequireAuth allowedRoles={ROLES.CUSTOMER} />}>
            <Route
              path="/customer-profile/:username"
              element={<CustomerProfile />}
            />
          </Route>
          <Route element={<RequireAuth allowedRoles={ROLES.ADMIN} />}>
            <Route path="/admin-profile/:username" element={<AdminProfile />} />
          </Route>

          <Route
            path="/manager-profile/:username"
            element={<ManagerProfile />}
          />

          {/* TODO: Update roles accordingly (you can import constant role dictionary from Roles.jsx) */}
          <Route path="/view-users" element={<ViewUsers />} />
          <Route path="/register-worker" element={<RegisterWorker />} />
          <Route path="/update-worker" element={<UpdateWorker />} />
          <Route path="/view-vehicles" element={<VehiclesList />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/update-vehicle" element={<UpdateVehicle />} />
          <Route path="/view-reports" element={<ReportList />} />
          <Route
            path="/winemaker-order-page"
            element={<WinemakerOrdersPage />}
          />

          {/* If no other routes are hooked, throw 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
