import React from "react";
import { useParams } from "react-router-dom";

const CustomerProfile = () => {
  const { username } = useParams();

  return (
    <div>
      <h1>Customer Profile</h1>
      <p>Username: {username}</p>
    </div>
  );
};

export default CustomerProfile;
