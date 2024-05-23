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
import { faPen, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Table from "../util/Table";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Unauthorized from "../auth/Unauthorized";

const PartnersList = () => {
  const [partners, setPartners] = useState([]);
  const [modal, setModal] = useState(false);
  const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const { auth } = useAuth();
  const { username, role } = auth || {};
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/partnerships/partners/");
        setPartners(response.data);
      } catch (error) {
        console.error("Error fetching partners data:", error);
      }
    };

    fetchData();
  }, []);

  const partnersWithDetails = partners.map((partner) => ({
    ...partner,
    addressWithStreetNumber: `${partner.address} ${partner.street_number}`,
    cityWithPostalCode: `${partner.city.name} ${partner.city.postal_code}`,
  }));

  const toggleModal = (partnerId) => {
    setSelectedPartnerId(partnerId);
    setModal(!modal);
  };

  const handleDeletePartner = async () => {
    try {
      console.log("Deleting Partner with ID: ", selectedPartnerId);
      await axios.delete(`/partnerships/partners/delete/${selectedPartnerId}/`);
      setPartners(partners.filter((partner) => partner.id !== selectedPartnerId));
      toggleModal(null);
      setDeleteSuccessModal(true);
    } catch (error) {
      console.error("Error deleting partner:", error);
      alert("Error deleting partner. Please try again later.");
    }
  };

  const toggle = () => setModal(!modal);

  const confirmDeleteModal = (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete Partner</ModalHeader>
      <ModalBody>Are you sure you want to delete this partner?</ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDeletePartner}>
          Delete
        </Button>{" "}
        <Button style={{ backgroundColor: "#4a5568" }} onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );

  const deleteSuccessModalContent = (
    <Modal isOpen={deleteSuccessModal} toggle={() => setDeleteSuccessModal(false)}>
      <ModalHeader toggle={() => setDeleteSuccessModal(false)}>
        Success
      </ModalHeader>
      <ModalBody>Partner Successfully Deleted</ModalBody>
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

  const partnerColumns = [
    { Header: "Partner Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Address", accessor: "addressWithStreetNumber" },
    { Header: "City", accessor: "cityWithPostalCode" },
    { Header: "Phone Number", accessor: "phone_number" },
    {
      Header: "Actions",
      accessor: "actions",  // Unique accessor for Actions column
      Cell: ({ row }) => (
        <div className="text-center">
          <Button color="danger" size="sm" onClick={() => toggleModal(row.original.id)}>
            Delete
          </Button>
        </div>
      ),
    },
    {
      Header: "Contact",
      accessor: "contact",  // Unique accessor for Contact column
      Cell: ({ row }) => (
        <div className="text-center">
          <Button color="primary" size="sm" onClick={() => navigate(`/send-contract/${row.original.id}`)}>
            Contact
          </Button>
        </div>
      ),
    },
  ];

  const getProfileLink = () => {
    switch (role) {
      case "MANAGER":
        return `/manager-profile/${username}`;
      default:
        return "/";
    }
  };

  return (
    <div>
      <div className="admin-background"></div>
      <Container>
        <Row>
          <Col>
            {role === "MANAGER" ? (
              <>
                <div className="mb-8">
                  <h1 className="text-xl font-semibold">Partners List</h1>
                  <div className="mt-4">
                    <Table columns={partnerColumns} data={partnersWithDetails} />
                  </div>
                </div>
                <div className="mt-4 mb-4 d-flex justify-content-between">
                  <Link
                    to="/add-partner"
                    className="btn view-user-btn btn-lg"
                    style={{ borderWidth: "3px", borderRadius: "20px" }}
                  >
                    <i>
                      <FontAwesomeIcon icon={faPen} className="mr-2" /> Register New Partner{" "}
                    </i>
                  </Link>

                  <Link
                    to={getProfileLink()}
                    className="btn view-user-btn btn-lg"
                    style={{ borderWidth: "3px", borderRadius: "20px" }}
                  >
                    <i>
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Go Back
                    </i>
                  </Link>
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
    </div>
  );
};

export default PartnersList;
