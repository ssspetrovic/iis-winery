import React, { useState, useEffect } from 'react';
import WineTank from './WineTank';
import axios from "../../api/axios";
import { Container, Row, Col, Button, Card, CardBody, CardImg, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddWineTank from './WineTankCreationFrom';

const WineRoom = ({ wineRoom }) => {
  const { id, name, area} = wineRoom;

  const [wineTanks, setWineTanks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  function toggleModal () {
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    fetchWineTanks();
  }, []);

  const fetchWineTanks = async () => {
    try {
      // Make a GET request to retrieve wine tanks by wine cellar ID
      const response = await axios.get(`/wine-tanks/?room=${id}`);
      setWineTanks(response.data); // Update state with retrieved wine tanks
    } catch (error) {
      console.error("Error fetching wine tanks:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">{name}</h2>
      <Row>
        <Col md={6}>
          <p><strong>Area:</strong> {parseInt(area) + 'm2'}</p>
        </Col>
        {/* <Col md={6} className="text-md-right">
          <Button color="primary">Edit Wine Room</Button>
        </Col> */}
      </Row>
      <Row md={'auto'}>
        {wineTanks.map((wineTank) => (
          <Col key={wineTank.tank_id} md={3}>
            <WineTank wineTank={wineTank} fetchWineTanks={fetchWineTanks} />
          </Col>
        ))}
        <Col>
          <Card onClick={toggleModal} style={{ height: '479px' }}>
            <CardBody className="d-flex justify-content-center align-items-center">
              <i class="bi bi-plus-circle-fill" style={{ fontSize: '10rem' }}/>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}><h2 className="mb-3">Add New Wine Tank</h2></ModalHeader>
        <ModalBody>
          <AddWineTank wineRoomId={id} toggleModal={toggleModal} fetchWineTanks={fetchWineTanks}/>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default WineRoom;
