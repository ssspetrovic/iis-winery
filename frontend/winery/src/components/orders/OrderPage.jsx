import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import DeliveryMap from "./DeliveryMap";
import { Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";

const OrderPage = () => {
  const [order, setOrder] = useState("");
  const [customer, setCustomer] = useState("");
  const [driver, setDriver] = useState("");
  const [wines, setWines] = useState([]);
  const [winemaker, setWinemaker] = useState("");

  // Izvući ID narudžbine iz URL-a
  const orderId = window.location.pathname.split("/").pop();

  useEffect(() => {
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
        const driverResponse = await axios.get(
          `/vehicles/${orderData.driver}/`
        );
        setDriver(driverResponse.data);

        // Fetch wine details
        const winePromises = orderData.wines.map(async (wineId) => {
          const wineResponse = await axios.get(`/wines/${wineId}/`);
          return wineResponse.data;
        });
        const wineData = await Promise.all(winePromises);
        setWines(wineData);

        // Fetch winemaker details
        const winemakerResponse = await axios.get(
          `/winemakers/${wineData[0].winemaker}/`
        );
        setWinemaker(winemakerResponse.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    // Call the function to fetch order details and additional details
    fetchOrderDetails();
  }, [orderId]);

  return (
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
              <CardBody tag="h4">Wines:</CardBody>
              <Row>
                {wines.map((wine, index) => (
                  <Col key={index} xs="6">
                    <Card>
                      <CardBody>
                        <CardTitle tag="h5">{wine.name}</CardTitle>
                        <CardText>
                          Sweetness: {wine.sweetness}
                          <br />
                          Acidity: {wine.acidity}
                          <br />
                          Alcohol: {wine.alcohol}%
                          <br />
                          pH: {wine.pH}
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
  );
};

export default OrderPage;
