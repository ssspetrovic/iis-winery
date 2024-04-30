import React, { useState, useEffect } from 'react';
import axios from "../../api/axios";

const VenueList = () => {
    const [venues, setVenues] = useState([]);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await axios.get('/venues');
                setVenues(response.data);
            } catch (error) {
                console.error('Error fetching venues:', error);
            }
        };

        fetchVenues();
    }, []);

    return (
        <div>
            <h2>Venues</h2>
            <ul>
                {venues.map(venue => (
                    <li key={venue.name}>
                        <h3>{venue.name}</h3>
                        <p>{venue.description}</p>
                        <p>Location: {venue.location}</p>
                        <p>Capacity: {venue.capacity}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VenueList;
