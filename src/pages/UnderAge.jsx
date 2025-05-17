import React from 'react';
import logo from '/logo.png';
// import logo from '/logo.png'; // Uncomment and adjust when logo is available

const CURRENT_YEAR = 2025;

const UnderAge = () => {
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center relative">
      <div className="flex flex-col items-center mb-3">
        <img src={logo} alt="Metadite Logo" className="w-12 h-12 mb-1" />
        <h1 className="text-2xl font-bold tracking-widest text-gray-900">METADITE</h1>
      </div>
      <h2 className="font-bold text-lg mt-2 mb-2 text-red-600">Underage Access Denied</h2>
      <p className="text-base text-gray-700 mb-5 text-center">
        Sorry, you must be at least 18 years old or the legal age of majority in your location to access this site.<br />
        Please come back when you meet the age requirement.
      </p>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 w-full justify-center">
        <img src={logo} alt="Metadite Logo Small" className="w-5 h-5" />
        <span>@ Metadite, {CURRENT_YEAR}</span>
      </div>
    </div>
  </div>
);
};

export default UnderAge;
