import { useState, useEffect } from "react";
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
  Card,
  CardBody,
  CardTitle,
  CardText,
} from "reactstrap";
import ConfirmationModal from "./ConformationModal";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWineBottle } from "@fortawesome/free-solid-svg-icons";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import useGoogleMapsApiKey from "../../hooks/googleAPIKey";

// Add your Google Maps API key here
// Define map container style and default center coordinates
const mapContainerStyle = {
  width: "100%",
  height: "400px", // Adjust the height as needed
};

// const defaultCenter = {
//   lat: 45.2671,
//   lng: 19.8335,
// };

const WinemakerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedVehicleData, setSelectedVehicleData] = useState(null);
  const [modal, setModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [isVehicleSelected, setIsVehicleSelected] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [vehicleLatLng, setVehicleLatLng] = useState(null);
  const { auth } = useAuth();
  const { username, role } = auth || {};
  const googleMapsApiKey = useGoogleMapsApiKey();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });

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
    if (role !== "WINEMAKER") {
      window.location.href = "/";
    }

    // Fetch winemaker's orders
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders/");
        const winemakerOrders = [];

        // Iteriraj kroz svaku narudžbinu
        for (const order of response.data) {
          let isWinemakerOrder = false;

          // Fetch item details for each item ID in the order
          const items = await Promise.all(
            order.items.map(async (itemId) => {
              const itemResponse = await axios.get(`/order-items/${itemId}/`);
              return itemResponse.data;
            })
          );

          // Iteriraj kroz svako vino u narudžbini
          for (const item of items) {
            // Uporedi ID winemakera sa ID-jem trenutno ulogovanog winemakera
            if (username === item.wine.winemaker) {
              isWinemakerOrder = true;
              break;
            }
          }

          // Ako je trenutno ulogovani winemaker napravio ovo vino, dodaj narudžbinu u niz
          if (!order.is_accepted && isWinemakerOrder) {
            // Izvuci podatke o korisniku (customer-u) iz narudžbine
            const customerResponse = await axios.get(
              `/customers/${order.customer}/`
            );
            const customerData = customerResponse.data;

            // Dodaj korisnika (customer-a) u objekat narudžbine
            const orderWithCustomer = { ...order, customerData, items };

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
  }, [role]);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleVehicleChange = async (e) => {
    const selectedVehicleId = e.target.value;
    setSelectedVehicle(selectedVehicleId);

    // Provera da li je selektovan ID vozila
    if (selectedVehicleId) {
      try {
        const response = await axios.get(`/vehicles/${selectedVehicleId}/`);
        setSelectedVehicleData(response.data);
        // Geokodiranje adrese vozila
        const { address, street_number, city, postal_code } = response.data;
        const fullAddress = `${street_number} ${address}, ${city.name}, ${postal_code}`;
        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: fullAddress }, (results, status) => {
            if (status === "OK" && results[0]) {
              setVehicleLatLng({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
              });
              console.log(vehicleLatLng);
            } else {
              console.error("No results found for the address:", fullAddress);
            }
          });
        } else {
          console.error("Google Maps API not available");
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        setSelectedVehicleData(null);
      }
      setIsVehicleSelected(true);
    } else {
      // Ako nije selektovan ID vozila, resetujte podatke o vozilu i postavite da vozilo nije selektovano
      setSelectedVehicleData(null);
      setIsVehicleSelected(false);
    }
  };

  const handleAcceptOrder = async () => {
    try {
      // Send request to accept order
      await axios.patch(`/orders/${selectedOrder.id}/`, {
        is_accepted: true,
        driver: selectedVehicle,
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
    <div>
      {" "}
      <div className="admin-background"></div>
      <Container>
        <Row>
          <Col>
            <h1 className="text-center">Winemaker Orders</h1>
            {orders.length > 0 ? (
              <ul className="list-unstyled row row-cols-3 column column-gap-9">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="my-3 border p-3 col-sm-5 mx-auto order-card"
                    style={{ position: "relative", color: "black" }}
                  >
                    <FontAwesomeIcon
                      icon={faWineBottle}
                      style={{
                        position: "absolute",
                        top: "130px",
                        right: "0",
                        fontSize: "400px",
                        color: "black",
                        opacity: "0.7",
                        zIndex: "-1",
                      }}
                    />
                    <p>
                      <strong>Order ID:</strong> {order.id}
                    </p>
                    <p>
                      <strong>Customer:</strong> {order.customerData.first_name}{" "}
                      {order.customerData.last_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.customerData.email}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.customerData.address}{" "}
                      {order.customerData.street_number}
                      {", "}
                      {order.customerData.city.name}{" "}
                      {order.customerData.city.postal_code}
                    </p>
                    <h3 className="mt-4">
                      <strong>Wines:</strong>
                    </h3>
                    <ul className="list-unstyled row row-cols-3 column column-gap-9">
                      {order.items.map((item) => (
                        <li
                          key={item.wine.id}
                          className="my-3  p-2 col-md-6 mx-7 mb-3"
                        >
                          <Card
                            className="h-100"
                            style={{
                              backgroundColor: "#fafafa",
                              color: "black",
                            }}
                          >
                            <CardBody>
                              <CardTitle tag="h5">{item.wine.name}</CardTitle>
                              <CardText>
                                <b>Sweetness:</b> {item.wine.sweetness}
                                <br />
                                <b>Alcohol:</b> {item.wine.alcohol}%
                                <br />
                                <b>Quantity:</b> {item.quantity}
                                <br />
                                <b>Type:</b> {item.wine.type}
                                <br />
                                <b>Age:</b> {item.wine.age}
                              </CardText>
                            </CardBody>
                          </Card>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => {
                        setSelectedOrder(order);
                        toggleModal();
                      }}
                      className="accept-order-button admin-button-black"
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
        {/* Modal section */}
        <Modal
          isOpen={modal}
          toggle={toggleModal}
          className="order-modal-content"
        >
          <ModalHeader toggle={toggleModal} className="order-modal-header">
            Accept Order
          </ModalHeader>
          <ModalBody>
            <Row>
              <select
                value={selectedVehicle}
                onChange={handleVehicleChange}
                className="form-control order-form-control"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.driver_name}
                  </option>
                ))}
              </select>
              <Col>
                {selectedVehicleData && (
                  <div>
                    <h4 className="mt-4 mb-4">Selected Vehicle Data</h4>
                    <p>
                      <strong>Driver Name:</strong>{" "}
                      {selectedVehicleData.driver_name}
                    </p>
                    <p>
                      <strong>Capacity:</strong>{" "}
                      {selectedVehicleData.capacity === 1
                        ? `${selectedVehicleData.capacity} ton`
                        : `${selectedVehicleData.capacity} tons`}
                    </p>
                    <p>
                      <strong>Phone Number:</strong>{" "}
                      {selectedVehicleData.phone_number}
                    </p>
                    <p>
                      <strong>Vehicle Type:</strong>{" "}
                      {selectedVehicleData.vehicle_type
                        .charAt(0)
                        .toUpperCase() +
                        selectedVehicleData.vehicle_type.slice(1)}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedVehicleData.address}{" "}
                      {selectedVehicleData.street_number}
                    </p>
                    <p>
                      <strong>City:</strong> {selectedVehicleData.city.name}
                    </p>
                  </div>
                )}
              </Col>
              <Col>
                <div>
                  {isLoaded && vehicleLatLng && (
                    <div>
                      <h3 className="text-center mt-4">Vehicle Location</h3>
                      <div
                        style={{
                          border: "1px solid black",
                          borderRadius: "5px",
                          overflow: "hidden",
                        }}
                      >
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          zoom={15}
                          center={{
                            lat: vehicleLatLng.lat,
                            lng: vehicleLatLng.lng,
                          }}
                        >
                          {/* Marker za prikaz lokacije vozila */}
                          <Marker
                            position={{
                              lat: vehicleLatLng.lat,
                              lng: vehicleLatLng.lng,
                            }}
                          />
                        </GoogleMap>
                      </div>{" "}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </ModalBody>

          <ModalFooter className="order-modal-footer">
            <Button
              className="admin-button-black"
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
        {/* Confirmation modal */}
        <ConfirmationModal
          isOpen={confirmationModalOpen}
          toggle={() => setConfirmationModalOpen(false)}
        />
      </Container>
    </div>
  );
};

export default WinemakerOrdersPage;
