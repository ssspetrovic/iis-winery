import React, { useState, useEffect } from 'react';
import axios from "../../api/axios";
import EventCreationForm from '../events/EventCreateionForm';

const VenueList = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVenue, setSelectedVenue] = useState(null);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await axios.get('/venues');
                setVenues(response.data);
            } catch (error) {
                setError(error);
            } finally{
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);
    
    if(loading){
        return <div>Loading...</div>;
    }
    if(error){
        return <div>Error: {error.message}</div>;
    }

    const handleReserveEvent = (venue) => {
        console.log(`Reserving event at venue with id: ${venue.id}`);
        setSelectedVenue(venue);
    }

    return (
        <div>
            <h2>Venues</h2>
            <ul>
                {venues.map(venue => (
                    <li key={venue.id}>
                        <h3>{venue.name}</h3>
                        <p>{venue.description}</p>
                        <p>Location: {venue.location}</p>
                        <p>Capacity: {venue.capacity}</p>
                        <button onClick={() => handleReserveEvent(venue)}>
                            Reserve Venue
                        </button>
                    </li>
                ))}
            </ul>
            {selectedVenue && <EventCreationForm venueId={selectedVenue.id} />}
        </div>
    );
};

export default VenueList;
