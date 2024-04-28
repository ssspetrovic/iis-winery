import { useState } from "react";

const useGoogleMapsApiKey = () => {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState(
    "AIzaSyBAx-8HIskKSQ2T4uE4SewJxYNtrzVeKDM"
  );

  return googleMapsApiKey;
};

export default useGoogleMapsApiKey;
