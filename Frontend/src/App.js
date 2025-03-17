import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ModelDetail from './pages/ModelDetail';
import Checkout from './pages/Checkout';
import ModeratorLogin from './pages/ModeratorLogin';
import ModeratorDashboard from './pages/ModeratorDashboard';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <div style={{ minHeight: '80vh', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/model/:id" element={<ModelDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/moderator/login" element={<ModeratorLogin />} />
            <Route path="/moderator/dashboard" element={<ModeratorDashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
