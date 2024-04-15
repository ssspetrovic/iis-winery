import React, { useState, useEffect } from "react";
import axiosPrivate from "../../api/axios";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSync, faSearch } from "@fortawesome/free-solid-svg-icons";
import Table from "../util/Table";
import { Link } from "react-router-dom";
import Unauthorized from "../auth/Unauthorized";
import useAuth from "../../hooks/useAuth";

const ViewUsers = () => {
  const [customers, setCustomers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [winemakers, setWinemakers] = useState([]);
  const [customerSearchText, setCustomerSearchText] = useState("");
  const [winemakerSearchText, setWinemakerSearchText] = useState("");
  const [managerSearchText, setManagerSearchText] = useState("");
  const { auth } = useAuth();
  const { username, role } = auth || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await axiosPrivate.get("/customers/", {
          headers: { "Content-Type": "application/json" },
        });
        setCustomers(customersResponse.data);

        const managersResponse = await axiosPrivate.get("/managers/", {
          headers: { "Content-Type": "application/json" },
        });
        setManagers(managersResponse.data);

        const winemakersResponse = await axiosPrivate.get("/winemakers/", {
          headers: { "Content-Type": "application/json" },
        });
        setWinemakers(winemakersResponse.data);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchData();
  }, []);

  const filterCustomers = (customer, searchText) => {
    return (
      customer.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.username.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filterWinemakers = (winemaker, searchText) => {
    return (
      winemaker.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      winemaker.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      winemaker.username.toLowerCase().includes(searchText.toLowerCase()) ||
      winemaker.email.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filterManagers = (manager, searchText) => {
    return (
      manager.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      manager.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      manager.username.toLowerCase().includes(searchText.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const customersTable = customers.map((customer) => ({
    ...customer,
    fullName: `${customer.first_name} ${customer.last_name}`,
    fullAddress: `${customer.address} ${customer.street_number}`,
  }));

  const winemakersTable = winemakers.map((winemaker) => ({
    ...winemaker,
    fullName: `${winemaker.first_name} ${winemaker.last_name}`,
    fullAddress: `${winemaker.address} ${winemaker.street_number}`,
  }));

  const managersTable = managers.map((manager) => ({
    ...manager,
    fullName: `${manager.first_name} ${manager.last_name}`,
  }));

  const customersColumns = [
    { Header: "Name", accessor: "fullName" },
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Address", accessor: "fullAddress" },
    { Header: "City", accessor: "city.name" },
  ];

  const winemakersColumns = [
    { Header: "Name", accessor: "fullName" },
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Address", accessor: "fullAddress" },
    { Header: "City", accessor: "city.name" },
  ];

  const managersColumns = [
    { Header: "Name", accessor: "fullName" },
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone_number" },
  ];

  if (role !== "ADMIN") {
    return <Unauthorized />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 admin-container">
      <h1 className="mb-5 text-center" style={{ color: "#4a5568" }}>
        View Users
      </h1>
      <div className="mt-4 mb-4 d-flex justify-content-between">
        <Link
          to="/register-worker"
          className="btn view-user-btn btn-lg"
          style={{ borderWidth: "3px", borderRadius: "20px" }}
        >
          <i>
            <FontAwesomeIcon icon={faPen} className="mr-2" /> Register New
            Worker{" "}
          </i>
        </Link>

        <Link
          to="/update-worker"
          className="btn view-user-btn btn-lg"
          style={{ borderWidth: "3px", borderRadius: "20px" }}
        >
          <i>
            <FontAwesomeIcon icon={faSync} className="mr-2" /> Update Worker{" "}
          </i>
        </Link>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-semibold">Customers</h1>
          <div className="mt-4 mb-4">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="admin-search"
                placeholder="Search..."
                value={customerSearchText}
                onChange={(e) => setCustomerSearchText(e.target.value)}
              />
            </div>
            <Table
              columns={customersColumns}
              data={customersTable.filter((customer) =>
                filterCustomers(customer, customerSearchText)
              )}
            />
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-xl font-semibold">Winemakers</h1>
          <div className="mt-4 mb-4">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="admin-search"
                placeholder="Search..."
                value={winemakerSearchText}
                onChange={(e) => setWinemakerSearchText(e.target.value)}
              />
            </div>
            <Table
              columns={winemakersColumns}
              data={winemakersTable.filter((winemaker) =>
                filterWinemakers(winemaker, winemakerSearchText)
              )}
            />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-semibold">Managers</h1>
          <div className="mt-4 mb-4">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="admin-search"
                placeholder="Search..."
                value={managerSearchText}
                onChange={(e) => setManagerSearchText(e.target.value)}
              />
            </div>
            <Table
              columns={managersColumns}
              data={managersTable.filter((manager) =>
                filterManagers(manager, managerSearchText)
              )}
            />
          </div>
        </div>
      </div>
      <div className="whitespace">.</div>
    </div>
  );
};

export default ViewUsers;
