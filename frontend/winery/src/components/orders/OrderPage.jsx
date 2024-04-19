import React, { useEffect, useState } from 'react';
import axios from "../../api/axios";
import DeliveryMap from './DeliveryMap';

const OrderPage = () => {
  const [order, setOrder] = useState("");
  const [customer, setCustomer] = useState("");
  const [winemaker, setWinemaker] = useState("");
  
  // Izvući ID narudžbine iz URL-a
  const orderId = window.location.pathname.split('/').pop();

  useEffect(() => {
    // Fetch order details and additional details about customer and winemaker
    const fetchOrderDetails = async () => {
      try {
        // Fetch order details
        const orderResponse = await axios.get(`/orders/${orderId}/`);
        const orderData = orderResponse.data;
        setOrder(orderData);
  
        // Extract customer ID and winemaker ID from order data
        const customerUsername = orderData.customer;

        const wineResponse = await axios.get(`/wines/${orderData.wines[0]}/`);
        const winemakerUsername = wineResponse.data.winemaker;

        // Fetch additional details about customer and winemaker
        const [customerResponse, winemakerResponse] = await Promise.all([
          axios.get(`/customers/${customerUsername}/`),
          axios.get(`/winemakers/${winemakerUsername}/`)
        ]);
  
        // Set customer and winemaker data
        console.log(customerResponse.data)
        console.log(winemakerResponse.data)
        setCustomer(customerResponse.data);
        setWinemaker(winemakerResponse.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };
  
    // Call the function to fetch order details and additional details
    fetchOrderDetails();
  }, [orderId]);

  return (
    <div>
      {order ? (
        <div>
          <h2>Order Details</h2>
          <p>ID: {order.id}</p>
          <p>Customer: {customer.username}</p>
          <p>Winemaker: {winemaker.username}</p>
          {/* Dodajte ostale detalje narudžbine ovde */}
          <DeliveryMap orderId={orderId} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default OrderPage;
