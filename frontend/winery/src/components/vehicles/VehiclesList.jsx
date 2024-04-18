import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSync, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Table from "../util/Table";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Unauthorized from "../auth/Unauthorized";

const VehiclesList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [modal, setModal] = useState(false);
  const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
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

  // Funkcija za otvaranje modala za brisanje
  const toggleModal = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setModal(!modal);
  };

  // Funkcija za brisanje vozila
  const handleDeleteVehicle = async () => {
    try {
      await axios.delete(`/vehicles/${selectedVehicleId}`);
      // Nakon uspešnog brisanja, ažuriramo listu vozila tako da se ukloni obrisano vozilo
      setVehicles(
        vehicles.filter((vehicle) => vehicle.id !== selectedVehicleId)
      );
      toggleModal(null);
      setDeleteSuccessModal(true);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Error deleting vehicle. Please try again later.");
    }
  };

  const toggle = () => setModal(!modal);

  const confirmDeleteModal = (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete Vehicle</ModalHeader>
      <ModalBody>Are you sure you want to delete this vehicle?</ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDeleteVehicle}>
          Delete
        </Button>{" "}
        <Button style={{ backgroundColor: "#4a5568" }} onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );

  const deleteSuccessModalContent = (
    <Modal
      isOpen={deleteSuccessModal}
      toggle={() => setDeleteSuccessModal(false)}
    >
      <ModalHeader toggle={() => setDeleteSuccessModal(false)}>
        Success
      </ModalHeader>
      <ModalBody>Vehicle Successfully Deleted</ModalBody>
      <ModalFooter>
        <Button
          style={{ backgroundColor: "#4a5568" }}
          onClick={() => setDeleteSuccessModal(false)}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );

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
      Header: role === "WINEMAKER" ? "Operational Status" : "Remove Driver",
      accessor: "id",
      Cell: ({ value, row }) =>
        role === "ADMIN" ? (
          <div className="text-center">
            <Button color="danger" size="sm" onClick={() => toggleModal(value)}>
              Delete
            </Button>
          </div>
        ) : row.original.is_operational ? (
          "Operational"
        ) : (
          "Not Operational"
        ),
    },
  ];

  const getProfileLink = () => {
    switch (role) {
      case "ADMIN":
        return `/admin-profile/${username}`;
      case "WINEMAKER":
        return `/winemaker-profile/${username}`;
      default:
        return "/";
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
              <div className="mt-4 mb-4 d-flex justify-content-between">
                <Link
                  to="/add-vehicle"
                  className="btn view-user-btn btn-lg"
                  style={{ borderWidth: "3px", borderRadius: "20px" }}
                >
                  <i>
                    <FontAwesomeIcon icon={faPen} className="mr-2" /> Register
                    New Worker{" "}
                  </i>
                </Link>

                <Link
                  to={getProfileLink()}
                  className="btn view-user-btn btn-lg"
                  style={{ borderWidth: "3px", borderRadius: "20px" }}
                >
                  <i>
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Go
                    Back
                  </i>
                </Link>

                <Link
                  to="/update-vehicle"
                  className="btn view-user-btn btn-lg"
                  style={{ borderWidth: "3px", borderRadius: "20px" }}
                >
                  <i>
                    <FontAwesomeIcon icon={faSync} className="mr-2" /> Update
                    Worker{" "}
                  </i>
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
            <Unauthorized />
          )}
        </Col>
      </Row>
      {confirmDeleteModal}
      {deleteSuccessModalContent}
    </Container>
  );
};

export default VehiclesList;
