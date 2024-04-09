import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSync } from "@fortawesome/free-solid-svg-icons";
import Table from "../hooks/Table";
import { Link } from "react-router-dom";

const ViewUsers = () => {
  const [customers, setCustomers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [winemakers, setWinemakers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await axios.get(
          `http://127.0.0.1:8000/api/customers`
        );
        setCustomers(customersResponse.data);

        const managersResponse = await axios.get(
          `http://127.0.0.1:8000/api/managers`
        );
        setManagers(managersResponse.data);

        const winemakersResponse = await axios.get(
          `http://127.0.0.1:8000/api/winemakers`
        );
        setWinemakers(winemakersResponse.data);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchData();
  }, []);

  // Parametri za svaku od tabela
  const customersColumns = [
    { Header: "Name", accessor: "first_name" },
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Address", accessor: "address" },
    { Header: "City", accessor: "city" },
  ];

  const winemakersColumns = [
    { Header: "Name", accessor: "first_name" },
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Address", accessor: "address" },
    { Header: "City", accessor: "city" },
  ];

  const managersColumns = [
    { Header: "Name", accessor: "first_name" },
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone_number" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-semibold">Customers</h1>
          <div className="mt-4">
            <Table columns={customersColumns} data={customers} />
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-xl font-semibold">Winemakers</h1>
          <div className="mt-4">
            <Table columns={winemakersColumns} data={winemakers} />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-semibold">Managers</h1>
          <div className="mt-4">
            <Table columns={managersColumns} data={managers} />
          </div>
        </div>
        <div className="mt-4 d-flex justify-content-between">
          <Link to="/register-worker">
            <Button color="primary">
              <FontAwesomeIcon icon={faPen} className="mr-2" />
              Register New Worker{" "}
            </Button>
          </Link>
          <Link to="/update-worker">
            <Button color="secondary">
              <FontAwesomeIcon icon={faSync} className="mr-2" />
              Update Worker{" "}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;
