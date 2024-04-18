import React, { useState, useEffect } from 'react';
import axios from "../../api/axios";
import WineRoom from './WineRoom';

const WineRoomsPage = () => {
  const [wineRooms, setWineRooms] = useState([]);

  useEffect(() => {
    fetchWineRooms();
  }, []);

  const fetchWineRooms = async () => {
    try {
      const response = await axios.get("/wine-rooms/", {
        headers: { "Content-Type": "application/json" },
      })
      console.log(response.data)
      setWineRooms(response.data);
    } catch (error) {
      console.error('Error fetching wine rooms:', error);
    }
  };

  const handleAddWineRoom = async (newWineRoomData) => {
    try {
      const response = await axios.post('/api/wine-rooms', newWineRoomData);
      setWineRooms([...wineRooms, response.data]);
    } catch (error) {
      console.error('Error adding wine room:', error);
    }
  };

  return (
    <div>
      {wineRooms.map((wineRoom) => (
        <WineRoom key={wineRoom.id} wineRoom={wineRoom} />
      ))}
    </div>
  );
};

export default WineRoomsPage;
