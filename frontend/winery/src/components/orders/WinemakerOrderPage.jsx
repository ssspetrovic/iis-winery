import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConformationModal";

const WinemakerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [modal, setModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [isVehicleSelected, setIsVehicleSelected] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("/vehicles/");
        const filteredVehicles = response.data.filter(
          (vehicle) => !vehicle.is_transporting && vehicle.is_operational
        );
        setVehicles(filteredVehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    if (userRole !== "WINEMAKER") {
      window.location.href = "/";
    }

    // Fetch winemaker's orders
    const fetchOrders = async () => {
      try {
        const winemakerResponse = await axios.get(
          `/winemakers/${localStorage.getItem("username")}/`
        );
        const winemakerId = winemakerResponse.data.id;
        const response = await axios.get("/orders/");
        const winemakerOrders = [];

        // Iteriraj kroz svaku narudžbinu
        for (const order of response.data) {
          let isWinemakerOrder = false;

          // Iteriraj kroz svako vino u narudžbini
          for (const wineId of order.wines) {
            // Izvrši Axios GET za vino kako bi se dobio winemaker
            const wineResponse = await axios.get(`/wines/${wineId}/`);

            // Uporedi ID winemakera sa ID-jem trenutno ulogovanog winemakera
            if (winemakerId === wineResponse.data.winemaker) {
              isWinemakerOrder = true;
              break;
            }
          }

          // Ako je trenutno ulogovani winemaker napravio ovo vino, dodaj narudžbinu u niz
          if (!order.is_accepted && isWinemakerOrder) {
            // Izvuci podatke o korisniku (customer-u) iz narudžbine
            const customerResponse = await axios.get(
              `/customers/?id=${order.customer}/`
            );
            const customerData = customerResponse.data;
            const winesData = [];
            for (const wineId of order.wines) {
              const wineResponse = await axios.get(`/wines/${wineId}/`);

              winesData.push(wineResponse.data);
            }

            // Dodaj korisnika (customer-a) u objekat narudžbine
            const orderWithCustomer = { ...order, customerData, winesData };

            // Dodaj narudžbinu u niz
            winemakerOrders.push(orderWithCustomer);
          }
        }

        setOrders(winemakerOrders);
      } catch (error) {
        console.error("Error fetching winemaker's orders:", error);
      }
    };

    fetchOrders();
  }, [userRole]);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleVehicleChange = (e) => {
    setSelectedVehicle(e.target.value);
    setIsVehicleSelected(!!e.target.value);
  };

  const handleAcceptOrder = async () => {
    try {
      // Send request to accept order
      await axios.patch(`/orders/${selectedOrder.id}/`, {
        is_accepted: true,
      });

      await axios.patch(`/vehicles/${selectedVehicle}/`, {
        is_transporting: true,
      });

      toggleModal();
      setConfirmationModalOpen(true);

      // Update orders state to reflect changes
      setOrders(orders.filter((order) => order.id !== selectedOrder.id));
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Winemaker Orders</h1>
          {orders.length > 0 ? (
            <ul className="list-unstyled row row-cols-3 column column-gap-9">
              {orders.map((order) => (
                <li key={order.id} className="my-3 border p-3 col-sm-5 mx-auto">
                  <p>
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>Customer:</strong>{" "}
                    {order.customerData[0].first_name}{" "}
                    {order.customerData[0].last_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.customerData[0].email}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.customerData[0].address}{" "}
                    {order.customerData[0].street_number}
                    {", "}
                    {order.customerData[0].city.name}{" "}
                    {order.customerData[0].city.postal_code}
                  </p>
                  <p>
                    <strong>Wines:</strong>
                  </p>
                  <ul className="list-unstyled row row-cols-3 column column-gap-9">
                    {order.winesData.map((wine) => (
                      <li
                        key={wine.id}
                        className="my-3 border p-2 col-md-6 mx-7 mb-3"
                      >
                        <p>
                          <strong>{wine.name}</strong>
                        </p>
                        <p>
                          Sweetness: {wine.sweetness}, Acidity: {wine.acidity}
                        </p>
                        <p>
                          Alcohol: {wine.alcohol}%, pH: {wine.pH}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <Button
                    color="primary"
                    onClick={() => {
                      setSelectedOrder(order);
                      toggleModal();
                    }}
                  >
                    Accept Order
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No winemaker orders available</p>
          )}
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Accept Order</ModalHeader>
        <ModalBody>
          <select
            value={selectedVehicle}
            onChange={handleVehicleChange}
            className="form-control"
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.driver_name}
              </option>
            ))}
          </select>
        </ModalBody>

        <ModalFooter>
          <Button
            color="primary"
            onClick={handleAcceptOrder}
            disabled={!isVehicleSelected}
          >
            Confirm
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <ConfirmationModal
        isOpen={confirmationModalOpen}
        toggle={() => setConfirmationModalOpen(false)}
      />
    </Container>
  );
};

export default WinemakerOrdersPage;
