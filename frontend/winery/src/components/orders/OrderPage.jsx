import { useEffect, useState } from "react";
import axios from "../../api/axios";
import DeliveryMap from "./DeliveryMap";
import { Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";

const OrderPage = () => {
  const [order, setOrder] = useState("");
  const [customer, setCustomer] = useState("");
  const [driver, setDriver] = useState("");
  const [items, setItems] = useState([]);
  const [winemaker, setWinemaker] = useState("");

  // Izvući ID narudžbine iz URL-a
  const orderId = window.location.pathname.split("/").pop();

  // Fetch order details and additional details about customer, driver, wines, and winemaker
  const fetchOrderDetails = async () => {
    try {
      // Fetch order details
      const orderResponse = await axios.get(`/orders/${orderId}/`);
      const orderData = orderResponse.data;
      setOrder(orderData);

      // Fetch customer details
      const customerResponse = await axios.get(
        `/customers/${orderData.customer}/`
      );
      setCustomer(customerResponse.data);

      // Fetch driver details
      if (orderData.driver) {
        const driverResponse = await axios.get(
          `/vehicles/${orderData.driver}/`
        );
        setDriver(driverResponse.data);
      }

      // Fetch item details
      const itemPromises = orderData.items.map(async (itemId) => {
        const itemResponse = await axios.get(`/order-items/${itemId}/`);
        return itemResponse.data;
      });

      const itemData = await Promise.all(itemPromises);
      setItems(itemData);
      console.log(itemData);

      // Fetch winemaker details
      const winemakerResponse = await axios.get(
        `/winemakers/${itemData[0].wine.winemaker}/`
      );
      setWinemaker(winemakerResponse.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    // Call the function to fetch order details and additional details
    fetchOrderDetails();
  }, [orderId]);

  return (
    <div>
      <div className="admin-background"></div>
      <div>
        <h1 className="text-center mb-4">Order Details</h1>
        <Row>
          <Col xs="6">
            <Card style={{ width: "600px", height: "600px" }}>
              <DeliveryMap orderId={orderId} />
            </Card>
          </Col>
          <Col xs="6">
            <Card>
              <CardBody>
                <CardTitle tag="h3">Order ID: {order.id}</CardTitle>
                <h5>
                  Customer: <span className="lead">{customer.username}</span>
                </h5>
                <h5>Order items:</h5>
                <Row>
                  {items.map((item, index) => (
                    <Col key={index} xs="6">
                      <Card>
                        <CardBody>
                          <CardTitle tag="h5">{item.wine.name}</CardTitle>
                          <CardText>
                            Sweetness: {item.wine.sweetness}
                            <br />
                            Acidity: {item.wine.acidity}
                            <br />
                            Alcohol: {item.wine.alcohol}%
                            <br />
                            pH: {item.wine.pH}
                            <br />
                            Quantity: {item.quantity}
                            <br />
                            Price: {item.wine.price}
                          </CardText>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
            <Row>
              <Col xs="6">
                <Card>
                  <CardBody>
                    <CardTitle tag="h4">Driver Data:</CardTitle>
                    {driver ? (
                      <CardText>
                        Name: {driver.driver_name}
                        <br />
                        Phone Number: {driver.phone_number}
                        <br />
                        Vehicle Type:{" "}
                        {driver.vehicle_type &&
                          driver.vehicle_type.charAt(0).toUpperCase() +
                            driver.vehicle_type.slice(1)}
                      </CardText>
                    ) : (
                      <CardText>
                        <span>No driver found</span>
                      </CardText>
                    )}
                  </CardBody>
                </Card>
              </Col>
              <Col xs="6">
                <Card>
                  <CardBody>
                    <CardTitle tag="h4">Winemaker Data:</CardTitle>
                    <CardText>
                      Name: {winemaker.first_name} {winemaker.last_name}
                      <br />
                      Address: {winemaker.address} {winemaker.street_number}
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OrderPage;
