import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Container, Row, Col, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSync } from "@fortawesome/free-solid-svg-icons";
import Table from "../util/Table";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const VehiclesList = () => {
  const [vehicles, setVehicles] = useState([]);
  const { auth } = useAuth();
  const { username, role } = auth || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles data:", error);
      }
    };

    fetchData();
  }, []);

  // Dohvatanje podataka za nove kolone
  const vehiclesWithAddress = vehicles.map((vehicle) => ({
    ...vehicle,
    addressWithStreetNumber: `${vehicle.address} ${vehicle.street_number}`, // Spajamo adresu i broj ulice
    cityWithPostalCode: `${vehicle.city.name} ${vehicle.city.postal_code}`, // Spajamo grad i poštanski broj
  }));

  // Parametri za tabelu vozila
  const vehicleColumns = [
    { Header: "Driver Name", accessor: "driver_name" },
    {
      Header: "Capacity",
      accessor: "capacity",
      Cell: ({ value }) => {
        if (value === 1) {
          return "1 Ton";
        } else if (value === 0.1) {
          return "0.1 Ton";
        } else {
          return `${value} Tons`;
        }
      },
    },
    { Header: "Address", accessor: "addressWithStreetNumber" },
    { Header: "Phone Number", accessor: "phone_number" },
    {
      Header: "Vehicle Type",
      accessor: "vehicle_type",
      Cell: ({ value }) => {
        return value.charAt(0).toUpperCase() + value.slice(1); // Prvo slovo veliko
      },
    },
    { Header: "City", accessor: "cityWithPostalCode" },
    {
      Header: role === "WINEMAKER" ? "Operational Status" : "",
      accessor: "id",
      Cell: ({ value, row }) =>
        role === "ADMIN" ? (
          <Button color="danger" onClick={() => handleDeleteVehicle(value)}>
            Delete
          </Button>
        ) : row.original.is_operational ? (
          "Operational"
        ) : (
          "Not Operational"
        ),
    },
  ];

  // Funkcija za brisanje vozila
  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await axios.delete(`/vehicles/${vehicleId}`);
      // Nakon uspešnog brisanja, ažuriramo listu vozila tako da se ukloni obrisano vozilo
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
      alert("Vehicle successfully deleted.");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Error deleting vehicle. Please try again later.");
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          {role === "ADMIN" ? (
            <>
              <div className="mb-8">
                <h1 className="text-xl font-semibold">Vehicles List</h1>
                <div className="mt-4">
                  <Table columns={vehicleColumns} data={vehiclesWithAddress} />
                </div>
              </div>
              <div className="mt-4 d-flex justify-content-between">
                <Link to="/add-vehicle">
                  <Button color="primary">
                    <FontAwesomeIcon icon={faPen} className="mr-2" />
                    Add New Vehicle
                  </Button>
                </Link>
                <Link to="/update-vehicle">
                  <Button color="secondary">
                    <FontAwesomeIcon icon={faSync} className="mr-2" />
                    Update Existing Vehicle
                  </Button>
                </Link>
              </div>
            </>
          ) : role === "WINEMAKER" ? (
            <>
              <div className="mb-8">
                <h1 className="text-xl font-semibold">Vehicles List</h1>
                <div className="mt-4">
                  <Table columns={vehicleColumns} data={vehiclesWithAddress} />
                </div>
              </div>
            </>
          ) : (
            <p>You don't have permission to access this page.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default VehiclesList;
