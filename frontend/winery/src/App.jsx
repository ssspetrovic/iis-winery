import { Routes, Route } from "react-router-dom";
import Register from "./components/auth/Register";
import TestPage from "./components/Test";
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
import WinemakerProfile from "./components/users/WinemakerProfile";
import PasswordResetForm from "./components/auth/PasswordResetForm";
import PasswordResetConfirmForm from "./components/auth/PasswordResetConfirmForm";
import WineRoomsPage from "./components/wine_cellar/WineRoomPage";
import FermentationDashboard from "./components/wm_dashboard/FermentationDashboard";
import OrderPage from "./components/orders/OrderPage";
import BrowseWines from "./components/customers/BrowseWines";
import ShoppingCart from "./components/customers/ShoppingCart";
import Home from "./Home";
import Orders from "./components/orders/OrderTest";
import AdminReport from "./components/pdf/AdminReport";
import OrderHistory from "./components/customers/OrdersHistory";
import VenueList from "./components/venues/VenueList";
import EventCreationForm from "./components/events/EventCreateionForm";
import Events from "./components/events/Events";
import SendInvitation from "./components/events/SendInvitation";
import UpcomingEvents from "./components/events/UpcomingEvents";
import AddPartner from "./components/partnerships/AddPartner";
import PartnerList from "./components/partnerships/PartnerList";
import SendContract from "./components/partnerships/SendContract";
import SignContract from "./components/partnerships/SignContract";
import Wishlist from "./components/customers/Wishlist";
import WineQuantity from "./components/util/WineQuantity";
import WineRecommendations from "./components/customers/WineRecommendations";
import { ROLES } from "./components/auth/Roles";
import "./index.css";
import "./assets/styles.css";

function App() {
  return (
    <div>
      <MainNavbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Unprotected */}
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/ordertest" element={<Orders />} />
          <Route path="/wine-quantity" element={<WineQuantity />} />

          <Route path="/reset-password" element={<PasswordResetForm />} />
          <Route
            path="/reset-password-confirm/:token"
            element={<PasswordResetConfirmForm />}
          />

          {/* Private */}
          <Route element={<RequireAuth allowedRoles={ROLES.CUSTOMER} />}>
            <Route
              path="/customer-profile/:username"
              element={<CustomerProfile />}
            />
          </Route>

          <Route element={<RequireAuth allowedRoles={ROLES.CUSTOMER} />}>
            <Route path="/profile/orders" element={<OrderHistory />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={ROLES.CUSTOMER} />}>
            <Route path="/profile/cart" element={<ShoppingCart />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={ROLES.CUSTOMER} />}>
            <Route path="/profile/wishlist" element={<Wishlist />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={ROLES.CUSTOMER} />}>
            <Route
              path="/profile/recommendations"
              element={<WineRecommendations />}
            />
          </Route>

          <Route element={<RequireAuth allowedRoles={ROLES.ADMIN} />}>
            <Route path="/admin-profile/:username" element={<AdminProfile />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={ROLES.ADMIN} />}>
            <Route
              path="/admin-profile/:username/generate-pdf"
              element={<AdminReport />}
            />
          </Route>

          <Route element={<RequireAuth allowedRoles={ROLES.WINEMAKER} />}>
            <Route
              path="/winemaker-profile/:username"
              element={<WinemakerProfile />}
            />
          </Route>

          <Route
            path="/manager-profile/:username"
            element={<ManagerProfile />}
          />

          <Route element={<RequireAuth allowedRoles={ROLES.WINEMAKER} />}>
            <Route path="/cellar" element={<WineRoomsPage />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={ROLES.WINEMAKER} />}>
            <Route path="/dashboard" element={<FermentationDashboard />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={ROLES.WINEMAKER} />}>
            <Route
              path="/winemaker-profile/:username"
              element={<WinemakerProfile />}
            />
          </Route>

          <Route
            element={
              <RequireAuth
                allowedRoles={[
                  ROLES.CUSTOMER,
                  ROLES.ADMIN,
                  ROLES.MANAGER,
                  ROLES.WINEMAKER,
                ]}
              />
            }
          >
            <Route path="/browse" element={<BrowseWines />} />
          </Route>

          {/* TODO: Update roles accordingly (you can import constant role dictionary from Roles.jsx) */}
          <Route path="/view-users" element={<ViewUsers />} />
          <Route path="/register-worker" element={<RegisterWorker />} />
          <Route path="/update-worker" element={<UpdateWorker />} />
          <Route path="/view-vehicles" element={<VehiclesList />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/update-vehicle" element={<UpdateVehicle />} />
          <Route path="/view-reports" element={<ReportList />} />
          <Route path="/view-venues" element={<VenueList />} />
          <Route path="/create-event" element={<EventCreationForm />} />
          <Route path="/events" element={<Events />} />
          <Route path="/send-invitations/:id" element={<SendInvitation />} />
          <Route path="/upcoming-events" element={<UpcomingEvents />} />
          <Route path="/add-partner" element={<AddPartner />} />
          <Route path="/view-partners" element={<PartnerList />} />
          <Route path="/send-contract/:partnerId" element={<SendContract />} />
          <Route path="/sign-contract/:token" element={<SignContract />} />
          <Route
            path="/winemaker-order-page"
            element={<WinemakerOrdersPage />}
          />
          <Route path="/orders/:id" element={<OrderPage />} />

          {/* If no other routes are hooked, throw 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
