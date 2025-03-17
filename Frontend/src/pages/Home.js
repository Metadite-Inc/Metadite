import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h1>Welcome to Metadite</h1>
    <p>Your one-stop platform for exclusive model content, shopping, and more.</p>
    <div>
      <Link to="/login"><button>Login</button></Link>
      <Link to="/dashboard"><button>Dashboard</button></Link>
    </div>
    <h2>Featured Models</h2>
    <ul>
      <li>
        <Link to="/model/1">Model 1</Link>
      </li>
      <li>
        <Link to="/model/2">Model 2</Link>
      </li>
      <li>
        <Link to="/model/3">Model 3</Link>
      </li>
    </ul>
  </div>
);

export default Home;
