import React, { useState } from 'react';
import axios from "../../api/axios";

const EventCreationForm = ({ venueId }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        time: '',
        number_of_guests: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/event/create/', { ...formData, venue: venueId });
            console.log('Event created successfully:', response.data);
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    return (
        <div>
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Event Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </label>
                <label>
                    Description:
                    <textarea name="description" value={formData.description} onChange={handleChange} />
                </label>
                <label>
                    Date:
                    <input type="date" name="date" value={formData.date} onChange={handleChange} />
                </label>
                <label>
                    Time:
                    <input type="time" name="time" value={formData.time} onChange={handleChange} />
                </label>
                <label>
                    Number of Guests:
                    <input type="number" name="number_of_guests" value={formData.number_of_guests} onChange={handleChange} />
                </label>
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
};

export default EventCreationForm;