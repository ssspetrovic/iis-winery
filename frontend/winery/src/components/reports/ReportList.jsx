import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import useAuth from "../../hooks/useAuth";
import Unauthorized from "../auth/Unauthorized";
import Table from "../util/Table";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [reportModal, setReportModal] = useState(false);
  const [replyModal, setReplyModal] = useState(false);
  const [newReport, setNewReport] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [adminConfirmModal, setAdminConfirmModal] = useState(false);
  const { auth } = useAuth();
  const { username, role } = auth || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/reports/`);
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredReports = reports.filter((report) => {
    if (role === "ADMIN") {
      return report.is_reviewed === false;
    } else {
      return report.user === username && report.is_reviewed === true;
    }
  });

  const handleReportProblem = async () => {
    try {
      await axios.post(`/reports/`, {
        user: username,
        description: newReport,
        is_reviewed: false,
        reply: null,
      });
      setReportModal(false);
      setConfirmModal(true);
    } catch (error) {
      console.error("Error reporting problem:", error);
      alert("Error reporting problem. Please try again later.");
    }
  };

  const handleOpenReplyModal = (report) => {
    setSelectedReport(report);
    setReplyText("");
    setReplyModal(true);
  };

  const handleReply = async () => {
    if (!selectedReport || !selectedReport.id) {
      console.error("Invalid report selected for reply.");
      return;
    }
    
    try {
      await axios.patch(`/reports/${selectedReport.id}/`, {
        reply: replyText,
        is_reviewed: true,
      });
      setReplyModal(false);
      setAdminConfirmModal(true);
    } catch (error) {
      console.error("Error replying to report:", error);
      alert("Error replying to report. Please try again later.");
    }
  };
  

  const toggleReportModal = () => {
    setReportModal(!reportModal);
  };

  const toggleReplyModal = () => {
    setReplyModal(!replyModal);
  };

  const toggleConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  const toggleAdminConfirmModal = () => {
    setAdminConfirmModal(!adminConfirmModal);
  };

  if (role === "WINEMAKER") {
    return <Unauthorized />;
  }

  const reportColumns = [{ Header: "Description", accessor: "description" }];

  if (role === "MANAGER" || role === "CUSTOMER") {
    reportColumns.push({
      Header: "Reply",
      accessor: "reply",
      Cell: ({ value }) => value || "No reply yet",
    });
  }

  if (role === "ADMIN") {
    reportColumns.push({
      Header: "Actions",
      accessor: "id",
      Cell: ({ row }) => (
        <Button
          color="primary"
          onClick={() => handleOpenReplyModal(row.original)} // Ovde prosleđujemo ceo red (izveštaj)
        >
          Reply
        </Button>
      ),
    });
  }

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Report List</h1>
        <div className="mt-4">
          <Table columns={reportColumns} data={filteredReports} />
          {role !== "ADMIN" && (
            <Button
              color="danger"
              onClick={toggleReportModal}
              className="btn-lg mx-auto d-block mt-4"
            >
              Report a Problem
            </Button>
          )}
        </div>
      </div>
      {/* Modal components */}
      {/* Confirm Modal */}
      <Modal isOpen={confirmModal} toggle={toggleConfirmModal}>
        <ModalHeader toggle={toggleConfirmModal}>Report Successful</ModalHeader>
        <ModalBody>
          <h4>Thank you for your patience!</h4>
        </ModalBody>
        <ModalFooter>
          {role === "CUSTOMER" && (
            <Link to={`/customer-profile/${username}`} className="view-user-btn">Go Back</Link>
          )}
          {role === "MANAGER" && (
            <Link to={`/manager-profile/${username}`} className="view-user-btn">Go Back</Link>
          )}
        </ModalFooter>
      </Modal>
      {/* Admin Confirm Modal */}
      <Modal isOpen={adminConfirmModal} toggle={toggleAdminConfirmModal}>
        <ModalHeader toggle={toggleAdminConfirmModal}>Success</ModalHeader>
        <ModalBody>
          <h4>Reply has been sent to the reporter</h4>
        </ModalBody>
        <ModalFooter>
          <ModalFooter>
            <Link to={`/admin-profile/${username}`} className="view-user-btn">Go Back</Link>
          </ModalFooter>{" "}
        </ModalFooter>
      </Modal>
      {/* Reply Modal */}
      <Modal isOpen={replyModal} toggle={toggleReplyModal}>
        <ModalHeader toggle={toggleReplyModal}>Reply to Report</ModalHeader>
        <ModalBody>
          <textarea
            className="form-control"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows="4"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleReply}>
            Reply
          </Button>{" "}
          <Button color="secondary" onClick={toggleReplyModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {/* Report Modal */}
      <Modal isOpen={reportModal} toggle={toggleReportModal}>
        <ModalHeader toggle={toggleReportModal}>Report a Problem</ModalHeader>
        <ModalBody>
          <textarea
            className="form-control"
            value={newReport}
            onChange={(e) => setNewReport(e.target.value)}
            rows="4"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleReportProblem}>
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={toggleReportModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default ReportList;
