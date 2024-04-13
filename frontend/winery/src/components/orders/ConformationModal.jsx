import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import profileRedirects from "../users/ProfileRedirect";

const ConfirmationModal = ({ isOpen, toggle }) => {
  const [modalMessage, setModalMessage] = useState("");

  // Handler za zatvaranje modala i resetovanje poruke
  const handleCloseModal = () => {
    setModalMessage("");
    toggle();
  };

  // Handler za redirekciju na odgovarajući profil
  const handleHomePageRedirect = () => {
    const username = localStorage.getItem("username");
    const redirectPath =
      profileRedirects[localStorage.getItem("role")](username);
    window.location.href = redirectPath;
  };

  return (
    <Modal isOpen={isOpen} toggle={handleCloseModal}>
      <ModalBody>
        <h2 className="text-center text-uppercase">SUCCESS</h2>
        <p className="text-center">Order has been sent to the customer.</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleHomePageRedirect}>
          Home Page
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
