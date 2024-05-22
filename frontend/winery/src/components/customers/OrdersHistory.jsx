import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button } from "reactstrap";

const OrdersHistory = () => {
  const navigate = useNavigate();

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
          <Container className="w-75">
            <div className="rounded shadow m-5">
              <Table hover className="rounded overflow-hidden text-center">
                <thead>
                  <tr>
                    <th className="align-middle">Order Id</th>
                    <th className="align-middle">Total Price</th>
                    <th className="align-middle">Accepted</th>
                    <th className="align-middle">Delivered</th>
                    <th className="align-middle">Order time</th>
                    <th className="align-middle"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="align-middle">{order.id}</td>
                      <td className="align-middle">{order.total_price} RSD</td>
                      <td className="align-middle">
                        {order.is_accepted ? "Yes" : "No"}
                      </td>
                      <td className="align-middle">
                        {order.is_delivered ? "Yes" : "No"}
                      </td>
                      <td className="align-middle">
                        {new Date(order.datetime).toLocaleString()}
                      </td>
                      <td className="align-middle">
                        <Button
                          color="dark"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          Order Details
                        </Button>
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
