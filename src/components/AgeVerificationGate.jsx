import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AgeVerificationModal from "./AgeVerificationModal";

const AgeVerificationGate = ({ children }) => {
  const location = useLocation();
  const [ageVerified, setAgeVerified] = useState(
    !!localStorage.getItem("age_verified")
  );
  const navigate = useNavigate();

  const handleAccept = () => {
    setAgeVerified(true);
    navigate("/#heroSection");
  };

  const handleReject = () => {
    setAgeVerified(false);
    navigate("/UnderAge");
  };

  // Allow /UnderAge route to render without modal
  if (location.pathname === "/UnderAge") {
    return children;
  }

  if (!ageVerified) {
    return <AgeVerificationModal onAccept={handleAccept} onReject={handleReject} />;
  }
  return children;
};

export default AgeVerificationGate;
