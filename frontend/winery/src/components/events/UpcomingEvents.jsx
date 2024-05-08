import React, { useState, useEffect } from 'react';
import axios from "../../api/axios";
import { Link } from 'react-router-dom';

const UpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/event');
                setEvents(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleSendInvitation = (eventId) => {
        console.log(`Sending invitations for event with ID: ${eventId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>Event List</h2>
            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        <h3>{event.name}</h3>
                        <p>Description: {event.description}</p>
                        <p>Date: {event.date}</p>
                        <p>Max Number of Guests: {event.number_of_guests}</p>
                        <Link to={`/send-invitations/${event.id}`}>
                            <button onClick={() => handleSendInvitation(event.id)}>
                                Send Invitation
                            </button>
                        </Link>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UpcomingEvents;