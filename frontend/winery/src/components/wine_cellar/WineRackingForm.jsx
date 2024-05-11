import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

function WineRacking({ wineTank, toggleModal }) {
  const [fromTankId, setFromTank] = useState(wineTank.tank_id);
  const [toTankId, setToTank] = useState(null); 
  const [wineTanks, setWineTanks] = useState([]);
  const [amount, setAmount] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  useEffect(() => {
    fetchWineTanks();
  }, []);

  const fetchWineTanks = async () => {
    try {
      const response = await axios.get(`/wine-tanks/`);
      setWineTanks(response.data);
    } catch (error) {
      console.error("Error fetching wine tanks:", error);
    }
  };

  const onCancel = () => {
    toggleModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fromTankId === toTankId) {
      setErrorMessage("From Tank and To Tank cannot be the same.");
      return;
    }
    try {
      const response = await axios.post("/wine-prod/wine-racking/", {
        from_tank: fromTankId,
        to_tank: toTankId,
        amount: amount,
        date_time: dateTime,
    });
      console.log(response)
      setSuccessModal(true);
      toggleModal();
    } catch (error) {
      console.error("Error performing wine racking:", error);
      setErrorMessage("Failed to perform wine racking. Please try again later.");
    }
  };

  const successModalContent = (
    <Modal isOpen={successModal} toggle={() => setSuccessModal(false)}>
      <ModalHeader toggle={() => setSuccessModal(false)}>Success</ModalHeader>
      <ModalBody>Wine Racking Completed</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => setSuccessModal(false)}>Close</Button>
      </ModalFooter>
    </Modal>
  );

  function handleChangeFromTank (e) {
    const selectedTankId = e.target.value;
    const tank1 = wineTanks.find(tank1.tank_id === selectedTankId)
    const tank2 = wineTanks.find(tank2.tank_id === toTankId)

    setFromTank(selectedTankId);
    if (selectedTankId === toTankId) {
      setErrorMessage("From Tank and To Tank cannot be the same.");
    } else {
      setErrorMessage("");
    }
  };

  function handleChangeToTank (e) {
    const selectedTankId = e.target.value;
    setToTank(selectedTankId);
    if (selectedTankId === fromTankId) {
      setErrorMessage("From Tank and To Tank cannot be the same.");
    } else {
      setErrorMessage("");
    }
  };

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="fromTank">From Tank</Label>
          <Input
            type="select"
            id="fromTank"
            value={fromTankId}
            onChange={(e) => handleChangeFromTank(e)}
          >
            <option value="">Select Wine Tank</option>
            {wineTanks.map((tank) => (
              <option key={tank.tank_id} value={tank.tank_id}>
                {tank.tank_id +
                  " " +
                  tank.tank_type +
                  " " +
                  parseInt(tank.current_volume) +
                  "L/" +
                  parseInt(tank.capacity) +
                  "L"}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="toTank">To Tank</Label>
          <Input
            type="select"
            id="toTank"
            value={toTankId}
            onChange={(e) => handleChangeToTank(e)}
          >
            <option value="">Select Wine Tank</option>
            {wineTanks.map((tank) => (
              <option key={tank.tank_id} value={tank.tank_id}>
                {tank.tank_id +
                  " " +
                  tank.tank_type +
                  " " +
                  parseInt(tank.current_volume) +
                  "L/" +
                  parseInt(tank.capacity) +
                  "L"}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="amount">Amount (in liters)</Label>
          <Input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="dateTime">Date and Time</Label>
            <Input
              type="datetime-local" // Use datetime-local type input
              id="dateTime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
        </FormGroup>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <div className="d-flex justify-content-end">
          <Button type="submit" color="primary" className="mx-4">
            Done
          </Button>
          <Button color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default WineRacking;
