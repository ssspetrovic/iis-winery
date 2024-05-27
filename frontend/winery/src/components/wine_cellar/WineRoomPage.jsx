import React, { useState, useEffect } from 'react';
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import axios from "../../api/axios";
import WineRoom from './WineRoom';
import AddWineCellar from './WineCellarCreateForm';

function WineRoomsPage () {
  const [wineRooms, setWineRooms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  function toggleModal () {
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    fetchWineRooms();
  }, []);

  const fetchWineRooms = async () => {
    try {
      const response = await axios.get("/wine-rooms/", {
        headers: { "Content-Type": "application/json" },
      })
      setWineRooms(response.data);
    } catch (error) {
      console.error('Error fetching wine rooms:', error);
    }
  };

  return (
    <div className='p-3 mb-2 bg-dark text-white'>
      {wineRooms.map((wineRoom) => (
        <WineRoom key={wineRoom.id} wineRoom={wineRoom} fetchWineRooms={fetchWineRooms}/>
      ))}
      <div className="d-flex justify-content-end">
        <span className="d-flex align-items-center me-3">Create Wine Cellar</span>
        <i className="bi bi-plus-circle-fill" style={{ fontSize: '4rem', cursor: 'pointer' }} onClick={toggleModal}/>
      </div>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}><h2 className="mb-3">Create Wine Cellar</h2></ModalHeader>
        <ModalBody>
          <AddWineCellar toggleModal={toggleModal} fetchWineCellars={fetchWineRooms}/>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default WineRoomsPage;
