import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

import { Container, Row, Col, Table, Button } from "reactstrap";

const OrdersHistory = () => {
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
    <>
      <Container fluid className="overflow-hidden p-0">
        <Row className="text-center">
          <Col className="bg-dark py-5">
            <h1 className="display-5 text-light">My Orders</h1>
          </Col>
        </Row>
        <Row>
          <Container className="w-50">
            <div className="rounded shadow">
              <Table hover className="rounded overflow-hidden text-center">
                <thead>
                  <tr>
                    <th>Order Id</th>
                    <th>Total Price</th>
                    <th>Accepted</th>
                    <th>Delivered</th>
                    <th>Order time</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.total_price}</td>
                      <td>{order.is_accepted ? "Yes" : "No"}</td>
                      <td>{order.is_delivered ? "Yes" : "No"}</td>
                      <td>{new Date(order.datetime).toLocaleString()}</td>
                      <td>
                        <Button color="dark">Order Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Container>
        </Row>
      </Container>
    </>
  );
};
export default OrdersHistory;
