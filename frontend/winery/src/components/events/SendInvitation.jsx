import React, { useState, useEffect } from 'react';
import axios from "../../api/axios";
import { useParams } from 'react-router-dom';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const { eventId } = useParams();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const handleCheckboxChange = (customerId) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };

  const handleSendInvitations = async () => {
    try {
      const response = await axios.post(`/api/events/${eventId}/send-invitations/`, {
        selected_customers: selectedCustomers
      });
      console.log('Invitations sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending invitations:', error);
    }
  };

  return (
    <div>
      <h2>Registered Customers</h2>
      <ul>
        {customers.map(customer => (
          <li key={customer.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedCustomers.includes(customer.id)}
                onChange={() => handleCheckboxChange(customer.id)}
              />
              {customer.name} - {customer.email}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSendInvitations}>Send Invitations</button>
    </div>
  );
};

export default CustomerList;
