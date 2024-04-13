import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");
  const [reportModal, setReportModal] = useState(false);
  const [replyModal, setReplyModal] = useState(false);
  const [newReport, setNewReport] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [adminConfirmModal, setAdminConfirmModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/reports/`);
        setReports(response.data);

        const role = localStorage.getItem("role");
        const username = localStorage.getItem("username");
        setUserRole(role);
        setUsername(username);
      } catch (error) {
        console.error("Error fetching reports data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredReports = reports.filter((report) => {
    if (userRole === "ADMIN") {
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
      setConfirmModal(true); // Otvara se modal za potvrdu
    } catch (error) {
      console.error("Error reporting problem:", error);
      alert("Error reporting problem. Please try again later.");
    }
  };

  const handleOpenReplyModal = (report) => {
    setSelectedReport(report);
    setReplyText(""); // Resetujemo reply tekst
    setReplyModal(true); // Otvara se modal
  };

  const handleReply = async () => {
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

  return (
    <Container>
      <Row>
        <Col>
          <div className="mb-8">
            <h1 className="text-xl font-semibold">Report List</h1>
            <div className="mt-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    {userRole === "ADMIN" && <th>Reply</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.description}</td>
                      {userRole !== "ADMIN" && (
                        <td>{report.reply ? report.reply : "No reply yet"}</td>
                      )}
                      {userRole === "ADMIN" && (
                        <td>
                          <Button
                            color="primary"
                            onClick={() => handleOpenReplyModal(report)}
                          >
                            Reply
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {userRole !== "ADMIN" && (
                <Button color="danger" onClick={toggleReportModal}>
                  Report a Problem
                </Button>
              )}
              <Modal isOpen={reportModal} toggle={toggleReportModal}>
                <ModalHeader toggle={toggleReportModal}>
                  Report a Problem
                </ModalHeader>
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
              <Modal isOpen={confirmModal} toggle={toggleConfirmModal}>
                <ModalHeader toggle={toggleConfirmModal}>
                  Report Successful
                </ModalHeader>
                <ModalBody>
                  <h4>Thank you for your patience!</h4>
                </ModalBody>
                <ModalFooter>
                  {userRole === "CUSTOMER" && (
                    <Link to={`/customer-profile/${username}`}>Go Back</Link>
                  )}
                  {userRole === "MANAGER" && (
                    <Link to={`/manager-profile/${username}`}>Go Back</Link>
                  )}
                </ModalFooter>
              </Modal>
              <Modal
                isOpen={adminConfirmModal}
                toggle={toggleAdminConfirmModal}
              >
                <ModalHeader toggle={toggleAdminConfirmModal}>
                  Success
                </ModalHeader>
                <ModalBody>
                  <h4>Reply has been sent to the reporter</h4>
                </ModalBody>
                <ModalFooter>
                  <Link to={`/admin-profile/${username}`}>Go Back</Link>
                </ModalFooter>
              </Modal>
            </div>
          </div>
        </Col>
      </Row>
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
    </Container>
  );
};

export default ReportList;
