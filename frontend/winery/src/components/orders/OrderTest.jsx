import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const Orders = () => {
  const { auth } = useAuth();
  const { username } = auth || {};
  const [orders, setOrders] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const fetchOrders = async () => {
    try {
      const response = await axiosPrivate.get(`/orders/?customer=${username}`);
      const ordersData = response.data;

      const ordersWithItemDetails = await Promise.all(
        ordersData.map(async (order) => {
          // Fetch item details for each item ID in the order
          const items = await Promise.all(
            order.items.map(async (itemId) => {
              const itemResponse = await axiosPrivate.get(
                `/order-items/${itemId}/`
              );
              return itemResponse.data;
            })
          );
          return { ...order, items };
        })
      );

      setOrders(ordersWithItemDetails);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [username, axiosPrivate]);

  return (
    <div>
      <h1>Orders for {username}</h1>
      {orders.map((order) => (
        <div key={`order_${order.id}`}>
          <h2>Order ID: {order.id}</h2>
          <h3>Total Price: {order.total_price}</h3>
          <ul>
            {order.items.map((item, index) => (
              <li key={item.id || index}>
                Wine: {item.wine.name} - Quantity: {item.quantity} - Price:{" "}
                {item.wine.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Orders;
