import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { useNavigate, Link } from "react-router-dom";
import "../../assets/adminReport.css";
import "../../assets/adminStyles.css";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import Spinner from "../util/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function AdminReport() {
  const [data, setData] = useState({
    winemakers: [],
    managers: [],
    customers: [],
    vehicles: [],
    reports: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { username, role } = auth || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const winemakers = await axios.get(
          "http://127.0.0.1:8000/api/winemakers/"
        );
        const managers = await axios.get("http://127.0.0.1:8000/api/managers/");
        const customers = await axios.get(
          "http://127.0.0.1:8000/api/customers/"
        );
        const vehicles = await axios.get("http://127.0.0.1:8000/api/vehicles/");
        const reports = await axios.get("http://127.0.0.1:8000/api/reports/");
        setData({
          winemakers: winemakers.data.slice(0, 3),
          managers: managers.data.slice(0, 3),
          customers: customers.data.slice(0, 3),
          vehicles: vehicles.data.slice(0, 3),
          reports: reports.data.slice(0, 3),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const generatePDF = () => {
    setIsLoading(true);
    axios
      .get(`http://127.0.0.1:8000/generate-admin-pdf/?username=${username}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "admin_report.pdf");
        document.body.appendChild(link);
        link.click();
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        setIsLoading(false);
      });
  };

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div>
      <div className="admin-background"></div>
      <div>
        <div className="bottom-button mb-4">
          <h1>
            Admin Data Summary <span>&nbsp;</span>
            <Link
              to={`/admin-profile/${username}`}
              className="btn view-user-btn"
              style={{ borderWidth: "3px", borderRadius: "20px" }}
            >
              <i>
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Go Back
              </i>
            </Link>
          </h1>
          <button
            onClick={generatePDF}
            className="admin-button"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Generate PDF"}
          </button>
        </div>
        <div className="admin-report-container">
          <Card
            className="data-section"
            onClick={() => handleCardClick("/view-users")}
          >
            <CardBody>
              <CardTitle tag="h2">Winemakers</CardTitle>
              <CardText>
                {data.winemakers.map((winemaker) => (
                  <div key={winemaker.id}>
                    <hr /> {/* Separator */}
                    <p>
                      <strong>Username:</strong> {winemaker.username}
                    </p>
                    <p>
                      <strong>First Name:</strong> {winemaker.first_name}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {winemaker.last_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {winemaker.email}
                    </p>
                    <p>
                      <strong>Address:</strong> {winemaker.address},{" "}
                      {winemaker.street_number}, {winemaker.city.name}
                    </p>
                  </div>
                ))}
              </CardText>
              <div className="show-more-overlay">Show More</div>
            </CardBody>
          </Card>
          <Card
            className="data-section"
            onClick={() => handleCardClick("/view-users")}
          >
            <CardBody>
              <CardTitle tag="h2">Managers</CardTitle>
              <CardText>
                {data.managers.map((manager) => (
                  <div key={manager.username}>
                    <hr /> {/* Separator */}
                    <p>
                      <strong>Username:</strong> {manager.username}
                    </p>
                    <p>
                      <strong>First Name:</strong> {manager.first_name}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {manager.last_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {manager.email}
                    </p>
                    <p>
                      <strong>Phone Number:</strong> {manager.phone_number}
                    </p>
                  </div>
                ))}
              </CardText>
              <div className="show-more-overlay">Show More</div>
            </CardBody>
          </Card>
          <Card
            className="data-section"
            onClick={() => handleCardClick("/view-users")}
          >
            <CardBody>
              <CardTitle tag="h2">Customers</CardTitle>
              <CardText>
                {data.customers.map((customer) => (
                  <div key={customer.id}>
                    <hr /> {/* Separator */}
                    <p>
                      <strong>Username:</strong> {customer.username}
                    </p>
                    <p>
                      <strong>First Name:</strong> {customer.first_name}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {customer.last_name}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong> {customer.date_of_birth}
                    </p>
                    <p>
                      <strong>Email:</strong> {customer.email}
                    </p>
                    <p>
                      <strong>Address:</strong> {customer.address},{" "}
                      {customer.street_number}, {customer.city.name}
                    </p>
                  </div>
                ))}
              </CardText>
              <div className="show-more-overlay">Show More</div>
            </CardBody>
          </Card>
          <Card
            className="data-section"
            onClick={() => handleCardClick("/view-vehicles")}
          >
            <CardBody>
              <CardTitle tag="h2">Vehicles</CardTitle>
              <CardText>
                {data.vehicles.map((vehicle) => (
                  <div key={vehicle.id}>
                    <hr /> {/* Separator */}
                    <p>
                      <strong>Driver Name:</strong> {vehicle.driver_name}
                    </p>
                    <p>
                      <strong>Phone Number:</strong> {vehicle.phone_number}
                    </p>
                    <p>
                      <strong>Vehicle Type:</strong> {vehicle.vehicle_type}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {vehicle.capacity}
                    </p>
                    <p>
                      <strong>Address:</strong> {vehicle.address},{" "}
                      {vehicle.street_number}, {vehicle.city.name}
                    </p>
                  </div>
                ))}
              </CardText>
              <div className="show-more-overlay">Show More</div>
            </CardBody>
          </Card>
          <Card
            className="data-section"
            onClick={() => handleCardClick("/view-reports")}
          >
            <CardBody>
              <CardTitle tag="h2">Reports</CardTitle>
              <CardText>
                {data.reports.map((report) => (
                  <div key={report.id}>
                    <hr /> {/* Separator */}
                    <p>
                      <strong>Description:</strong> {report.description}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {report.is_reviewed ? "Reviewed" : "Not Reviewed"}
                    </p>
                    <p>
                      <strong>Reply:</strong> {report.reply}
                    </p>
                  </div>
                ))}
              </CardText>
              <div className="show-more-overlay">Show More</div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminReport;
