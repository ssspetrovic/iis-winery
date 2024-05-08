import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import profileRedirects from "../users/ProfileRedirect";
import useAuth from "../../hooks/useAuth";

const ConfirmationModal = ({ isOpen, toggle }) => {
  const [modalMessage, setModalMessage] = useState("");
  const { auth } = useAuth();
  const { username, role } = auth || {};

  // Handler za zatvaranje modala i resetovanje poruke
  const handleCloseModal = () => {
    setModalMessage("");
    toggle();
  };

  // Handler za redirekciju na odgovarajući profil
  const handleHomePageRedirect = () => {
    const redirectPath = profileRedirects[role](username);
    window.location.href = redirectPath;
  };

  return (
    <Modal isOpen={isOpen} toggle={handleCloseModal}>
      <ModalBody>
        <h2 className="text-center text-uppercase" style={{color: "black"}}>SUCCESS</h2>
        <p className="text-center" style={{color: "black"}}>Order has been sent to the customer.</p>
      </ModalBody>
      <ModalFooter>
        <Button style={{backgroundColor: "black"}} onClick={handleHomePageRedirect}>
          Home Page
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
