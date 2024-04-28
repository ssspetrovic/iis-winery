import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import carIconUrl from "../../assets/images/google_car.png";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faTimes } from "@fortawesome/free-solid-svg-icons";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Default center coordinates
const defaultCenter = {
  lat: 0,
  lng: 0,
};

const carIcon = {
  url: carIconUrl, // Koristimo relativnu putanju do slike
};

const DeliveryMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBAx-8HIskKSQ2T4uE4SewJxYNtrzVeKDM",
  });

  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState("");
  const [winemaker, setWinemaker] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [customerLatLng, setCustomerLatLng] = useState(null);
  const [winemakerLatLng, setWinemakerLatLng] = useState(null);
  const [vehiclePosition, setVehiclePosition] = useState(null);
  const [showModal, setShowModal] = useState(false); // State za prikazivanje modala
  const prevPositionRef = useRef(null); // Ref za prethodnu poziciju vozila
  const mapRef = useRef(null); // Ref za pristup instanci mape
  const { auth } = useAuth();
  const { username, role } = auth || {};

  useEffect(() => {
    if (order && isAccepted && customer && winemaker) {
      optimizeRouteAndDisplayMap(order);
    }
  }, [order, isAccepted, customer, winemaker]);

  useEffect(() => {
    // Fetch order data from the backend
    axios
      .get(`/orders/${id}/`)
      .then((response) => {
        const orderData = response.data;
        setOrder(orderData);

        axios.get(`/customers/${orderData.customer}/`).then((response) => {
          const customerData = response.data;
          setCustomer(customerData);
        });

        axios.get(`/wines/${orderData.wines[0]}/`).then((response) => {
          axios
            .get(`/winemakers/${response.data.winemaker}`)
            .then((response) => {
              const winemakerData = response.data;
              setWinemaker(winemakerData);
            });
        });

        setIsAccepted(orderData.is_accepted);
        setIsDelivered(orderData.is_delivered);
        // Provera da li je porudžbina prihvaćena
        if (orderData.is_accepted) {
          // Poziv funkcije za optimizaciju rute i prikaz na mapi
          optimizeRouteAndDisplayMap(orderData);
        } else {
          console.log("Porudžbina nije prihvaćena.");
          setIsAccepted(false);
        }
      })
      .catch((error) => {
        console.error("Greška pri dohvatanju podataka o porudžbini:", error);
        setIsAccepted(false);
      });
  }, [id]);

  const optimizeRouteAndDisplayMap = (orderData) => {
    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.DirectionsService
    ) {
      // Čekanje i ponovni pokušaj ako Google Maps API ili DirectionsService nisu učitani
      setTimeout(() => {
        optimizeRouteAndDisplayMap(orderData);
      }, 100);
      return;
    }

    if (
      !customer ||
      !winemaker ||
      !customer.address ||
      !winemaker.address ||
      !customer.city ||
      !winemaker.city
    ) {
      // Ponovni pokušaj ako potrebni podaci o lokaciji nisu dostupni
      setTimeout(() => {
        optimizeRouteAndDisplayMap(orderData);
      }, 100);
      return;
    }

    // Kreiranje objekta geokodera
    const geocoder = new window.google.maps.Geocoder();

    // Geokodiranje adrese kupca
    geocoder.geocode({ address: customer.address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const customerLocation = results[0].geometry.location;
        const customerLat = customerLocation.lat();
        const customerLng = customerLocation.lng();
        setCustomerLatLng({ lat: customerLat, lng: customerLng });

        // Geokodiranje adrese vinara
        geocoder.geocode({ address: winemaker.address }, (results, status) => {
          if (status === "OK" && results[0]) {
            const winemakerLocation = results[0].geometry.location;
            const winemakerLat = winemakerLocation.lat();
            const winemakerLng = winemakerLocation.lng();
            setWinemakerLatLng({ lat: winemakerLat, lng: winemakerLng });

            // Poziv Google Maps JavaScript API za dobijanje optimalne rute
            const directionsService =
              new window.google.maps.DirectionsService();
            directionsService.route(
              {
                origin: {
                  lat: winemakerLat,
                  lng: winemakerLng,
                },
                destination: {
                  lat: customerLat,
                  lng: customerLng,
                },
                travelMode: "DRIVING",
              },
              (response, status) => {
                if (status === "OK") {
                  // Ako je odgovor primljen, prikaži rutu na mapi
                  const directionsRenderer =
                    new window.google.maps.DirectionsRenderer();
                  directionsRenderer.setMap(mapRef.current); // Postavi instancu mape ovde
                  directionsRenderer.setDirections(response);

                  // Podesi poziciju vozila na početnu tačku (vinar)
                  setVehiclePosition({ lat: winemakerLat, lng: winemakerLng });
                  prevPositionRef.current = {
                    lat: winemakerLat,
                    lng: winemakerLng,
                  };

                  // Kreiranje intervala za ažuriranje pozicije vozila
                  const interval = setInterval(() => {
                    // Izračunaj novu poziciju vozila duž rute
                    const nextStep = response.routes[0].legs[0].steps.find(
                      (step) =>
                        step.start_location.lat() ===
                          prevPositionRef.current.lat &&
                        step.start_location.lng() ===
                          prevPositionRef.current.lng
                    );
                    if (nextStep) {
                      const newPosition = {
                        lat: nextStep.end_location.lat(),
                        lng: nextStep.end_location.lng(),
                      };
                      setVehiclePosition(newPosition);
                      prevPositionRef.current = newPosition;
                    } else {
                      // Vozilo je stiglo na odredište, prekini interval
                      clearInterval(interval);

                      axios
                        .patch(`/vehicles/${orderData.driver}/`, {
                          is_transporting: false,
                        })
                        .then((response) => {
                          console.log("Vozač oslobodjen!");
                        })
                        .catch((error) => {
                          console.error(
                            "Vozaču nije dozvoljena sloboda: ",
                            error
                          );
                        });

                      axios
                        .patch(`/orders/${id}/`, { is_delivered: true })
                        .then((response) => {
                          console.log(
                            "Status porudžbine je ažuriran na isporučeno."
                          );
                        })
                        .catch((error) => {
                          console.error(
                            "Greška pri ažuriranju statusa porudžbine:",
                            error
                          );
                        });

                      // Otvaranje modala
                      setShowModal(true);
                    }
                  }, 5000); // Podesite interval prema potrebi
                } else {
                  console.error("Greška pri dohvatanju rute:", status);
                }
              }
            );
          } else {
            console.error("Geokodiranje nije uspelo za adresu vinara:", status);
          }
        });
      } else {
        console.error("Geokodiranje nije uspelo za adresu kupca:", status);
      }
    });
  };

  return isLoaded &&
    order &&
    isAccepted &&
    customerLatLng &&
    winemakerLatLng &&
    isDelivered ? (
    isDelivered ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 className="text-center">Ova porudžbina je već izvršena!</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FontAwesomeIcon icon={faCheckSquare} size="10x" />
        </div>
      </div>
    ) : (
      <>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={defaultCenter} // Postavi podrazumevani centar ovde
          onLoad={(map) => (mapRef.current = map)} // Postavi ref mape kada se mapa učita
        >
          {/* Prikaz markera kupca */}
          {customerLatLng && (
            <Marker
              position={{ lat: customerLatLng.lat, lng: customerLatLng.lng }}
            />
          )}

          {/* Prikaz markera vinara */}
          {winemakerLatLng && (
            <Marker
              position={{ lat: winemakerLatLng.lat, lng: winemakerLatLng.lng }}
            />
          )}

          {/* Prikaz markera vozila */}
          {vehiclePosition && (
            <Marker
              position={{ lat: vehiclePosition.lat, lng: vehiclePosition.lng }}
              icon={{
                url: carIcon.url,
                scaledSize: { width: 50, height: 50 }, // Veličina ikone
              }}
            />
          )}
        </GoogleMap>
        {/* Modal za prikazivanje poruke o isporuci */}
        <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
          <ModalHeader toggle={() => setShowModal(false)}>
            Order Successful
          </ModalHeader>
          <ModalBody>
            <p>
              Thank you for your patience, your order is waiting for you at your
              doorstep.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" href={`/customer-profile/${username}`}>
              Home Page
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  ) : (
    <div>
      {!isAccepted && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ marginRight: "10px" }}>Porudžbina još nije prihvaćena.</p>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </div>
      )}{" "}
      {!isLoaded && <p>Učitavanje...</p>}
    </div>
  );
};

export default DeliveryMap;
