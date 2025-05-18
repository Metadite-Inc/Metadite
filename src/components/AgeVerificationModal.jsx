import React, { useState, useEffect } from 'react';
import logo from '/logo.png';

const CURRENT_YEAR = 2025;

const AgeVerificationModal = ({ onAccept, onReject }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('age_verified');
    if (!isVerified) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('age_verified', 'true');
    setShow(false);
    onAccept();
  };

  const handleReject = () => {
    setShow(false);
    onReject();
  };

  if (!show) return null;

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center relative">
      <div className="flex flex-col items-center mb-3">
        <img src={logo} alt="Metadite Logo" className="w-12 h-12 mb-1" />
        <h1 className="text-2xl font-bold tracking-widest text-gray-900">METADITE</h1>
      </div>
      <h2 className="font-bold text-lg mt-2 mb-2">This is an adult website</h2>
      <p className="text-base text-gray-700 mb-5 text-center">
        You must be at least 18 years old or the legal age of majority in your location to access this site. By entering, you confirm that you meet the age requirement and consent to viewing content intended for adults, which may include nudity and explicit material.
      </p>
      <div className="flex flex-col gap-3 w-full mb-3">
        <button
          className="bg-metadite-primary text-white font-medium rounded-md py-3 text-base hover:bg-metadite-secondary transition-colors shadow"
          onClick={handleAccept}
        >
          I am 18 years and older - Enter
        </button>
        <button
          className="bg-gray-900 text-white font-medium rounded-md py-3 text-base hover:bg-gray-700 transition-colors shadow"
          onClick={handleReject}
        >
          I am under 18 - Exit
        </button>
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 w-full justify-center">
        <img src={logo} alt="Metadite Logo Small" className="w-5 h-5" />
        <span>@Metadite, {CURRENT_YEAR}</span>
      </div>
    </div>
  </div>
);
};

export default AgeVerificationModal;
