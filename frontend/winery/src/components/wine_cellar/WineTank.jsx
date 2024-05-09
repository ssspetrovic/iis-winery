import React, {useState} from 'react';
import { 
  Card, 
  CardHeader, 
  CardImg, 
  CardBody, 
  CardTitle, 
  CardText, 
  Progress, 
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem, 
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter, 
} from 'reactstrap';
import rackingIcon from '../../assets/images/racking.png';
import wineTankIcon from '../../assets/images/winetank.png';
import barrelIcon from '../../assets/images/barrel_template.png'; 
import axios from "../../api/axios";
import WineRacking from './WineRackingForm';

function WineTank ({ wineTank, fetchWineTanks }) {
  const { tank_id, capacity, current_volume, tank_type, room } = wineTank;
  const [modalOpen, setModalOpen] = useState(false);

  function toggleModal () {
    setModalOpen(!modalOpen);
  };

  // Calculate the progress percentage
  const progress = (current_volume / capacity) * 100;

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/wine-prod/wine-tanks/${room}/${tank_id}/`);
      fetchWineTanks();
    } catch (error) {
      // Handle error or display an error message
      console.error('Error deleting wine tank:', error);
    }
  };

  return (
    <Card className="mb-3">
      <CardHeader className="d-flex justify-content-end" style={{ borderBottom: 'none', backgroundColor: 'inherit' }}>
        <UncontrolledDropdown>
          <DropdownToggle color="transparent">
            <i className="bi bi-three-dots"/>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={toggleModal}>
              <img src={rackingIcon} style={{ width: '24px', height: '24px' }} /> Racking
            </DropdownItem>
            <DropdownItem>
              <i class="bi bi-pencil-square"/> Modify
            </DropdownItem>
            <DropdownItem onClick={handleDelete}>
              <i className="bi bi-trash" /> Delete
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader>
      <CardTitle className="font-weight-bold text-center"><strong>{tank_id}</strong></CardTitle>
      <CardImg top src={tank_type === 'Inox' ? wineTankIcon : barrelIcon}/>
      <CardBody>
        <CardText className="text-center">
          <strong>Capacity:</strong> {capacity} liters
        </CardText>
        <CardText>
          <strong>Current Volume:</strong>
          <Progress value={progress} />
        </CardText>
      </CardBody>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}><h2 className="mb-3">Wine Racking</h2></ModalHeader>
      <ModalBody>
        <WineRacking wineTank={wineTank} toggleModal={toggleModal}/>
      </ModalBody>
      </Modal>
    </Card>
  );
};

export default WineTank;
