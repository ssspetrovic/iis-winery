import React, { useState, useEffect } from 'react';
import WineTank from './WineTank';
import axios from "../../api/axios";
import { Container, Row, Col, Button, Card, CardBody, CardImg } from 'reactstrap';
import addIcon from '../../assets/images/plusicon.png';

const WineRoom = ({ wineRoom }) => {
  const { id, name, area} = wineRoom;

  const [wineTanks, setWineTanks] = useState([]);

  useEffect(() => {
    fetchWineTanks();
  }, []);

  const fetchWineTanks = async () => {
    try {
      // Make a GET request to retrieve wine tanks by wine cellar ID
      const response = await axios.get(`/wine-tanks/?room_id=${id}`);
      console.log(response.data)
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
          <p><strong>Area:</strong> {area}</p>
        </Col>
        {/* <Col md={6} className="text-md-right">
          <Button color="primary">Edit Wine Room</Button>
        </Col> */}
      </Row>
      <Row md={12}>
        {wineTanks.map((wineTank) => (
          <Col key={wineTank.tank_id} className="mb-3">
            <WineTank wineTank={wineTank} />
          </Col>
        ))}
        <Col>
          <Card onClick={() => console.log('Add new wine tank')} style={{ height: '479px' }}>
            <CardBody className="d-flex justify-content-center align-items-center">
              <i class="bi bi-plus-circle-fill" style={{ fontSize: '12rem' }}/>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WineRoom;
