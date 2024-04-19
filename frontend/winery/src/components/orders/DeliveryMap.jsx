import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 0,
  lng: 0,
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
  const [vehiclePosition, setVehiclePosition] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [customerLatLng, setCustomerLatLng] = useState(null);
  const [winemakerLatLng, setWinemakerLatLng] = useState(null);

  useEffect(() => {
    // Učitaj podatke o narudžbini iz backenda
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

        // Proveri da li je narudžbina prihvaćena
        if (orderData.is_accepted) {
          // Pozovi funkciju za optimizaciju rute i prikaz na mapi
          optimizeRouteAndDisplayMap(orderData);
        } else {
          console.log("Order is not accepted.");
          setIsAccepted(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
        setIsAccepted(false);
      });
  }, [id]);

  const optimizeRouteAndDisplayMap = (orderData) => {
    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.DirectionsService
    ) {
      // Google Maps API ili DirectionsService nisu učitani, sačekajmo trenutak i pokušajmo ponovo
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
      setTimeout(() => {
        optimizeRouteAndDisplayMap(orderData);
      }, 100);
      return;
    }
  
    // Kreiranje geokoder objekta
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

            // Poziv Google Maps JavaScript API-ja za dobijanje optimalne rute
            const directionsService = new window.google.maps.DirectionsService();
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
                  // Ako je dobijen odgovor, prikazi rutu na mapi
                  const directionsRenderer = new window.google.maps.DirectionsRenderer();
                  directionsRenderer.setMap(mapInstance);
                  directionsRenderer.setDirections(response);
                } else {
                  console.error("Error fetching route:", status);
                }
              }
            );
          } else {
            console.error("Geocode was not successful for the winemaker address:", status);
          }
        });
      } else {
        console.error("Geocode was not successful for the customer address:", status);
      }
    });
  };
  
  return isLoaded && order && isAccepted ? (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={center}>
      {/* Prikaz markera za kupca */}
      <Marker position={{ lat: order.customer.lat, lng: order.customer.lng }} />

      {/* Prikaz markera za vinara */}
      <Marker
        position={{
          lat: winemaker.lat,
          lng: winemaker.lng,
        }}
      />

      {/* Prikaz polilinije za optimalnu rutu */}
      {vehiclePosition && (
        <Polyline
          path={[
            { lat: vehiclePosition.startLat, lng: vehiclePosition.startLng },
            { lat: vehiclePosition.endLat, lng: vehiclePosition.endLng },
          ]}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 1,
            strokeWeight: 3,
          }}
        />
      )}

      {/* Prikaz vozila */}
      {vehiclePosition && (
        <Marker
          position={{ lat: vehiclePosition.lat, lng: vehiclePosition.lng }}
          icon={{
            url: "URL_TO_VEHICLE_ICON",
            scaledSize: new window.google.maps.Size(50, 50), // Velicina ikonice
          }}
        />
      )}
    </GoogleMap>
  ) : (
    <div>
      {!isAccepted && <p>The order has not been accepted yet.</p>}
      {!isLoaded && <p>Loading...</p>}
    </div>
  );
};

export default DeliveryMap;
