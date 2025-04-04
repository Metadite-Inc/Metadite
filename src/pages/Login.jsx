
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-br from-white via-metadite-light to-white">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
