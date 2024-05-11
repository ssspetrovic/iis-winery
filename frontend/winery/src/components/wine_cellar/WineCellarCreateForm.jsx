import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

function AddWineCellar({toggleModal, fetchWineCellars}) {
  const [wineCellarName, setWineCellarName] = useState("");
  const [area, setArea] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/wine-rooms/`, {
        name: wineCellarName,
        area: area,
      });

      setWineCellarName("");
      setArea("");
      setErrorMessage("");
      setSuccessModal(true);
      fetchWineCellars(); 
      toggleModal();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to create wine cellar. Please try again later.");
    }
  };

  const onCancel = () => {
    toggleModal();
  } 

  useEffect(() => {
    fetchWineCellars();
  }, []);

  const successModalContent = (
    <Modal isOpen={successModal} toggle={() => setSuccessModal(false)}>
      <ModalHeader toggle={() => setSuccessModal(false)}>Success</ModalHeader>
      <ModalBody>Wine Tank Successfully Added</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => setSuccessModal(false)}>Close</Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="wineCellarName">Wine Cellar Name</Label>
              <Input
                type="text"
                id="wineCellarName"
                value={wineCellarName}
                onChange={(e) => setWineCellarName(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="area">Area (m2)</Label>
              <Input
                type="text"
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="d-flex justify-content-end">
          <Button type="submit" color="primary" className="mx-4">Create</Button>
          <Button color="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      </Form>
      {successModalContent}
    </Container>
  );
}

export default AddWineCellar;
