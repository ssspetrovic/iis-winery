import React from 'react';
import { Link } from 'react-router-dom';

const Events = () => {
    return (
        <div>
            <Link to="/view-venues">
                <button>Reserve Event</button>
            </Link>
            <Link to="/upcoming-events">
                <button>Upcoming events</button>
            </Link>
        </div>
    );
};

export default Events;