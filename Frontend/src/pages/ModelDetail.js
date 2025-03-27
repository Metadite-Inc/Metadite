import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ModelDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Model Detail: Model {id}</h1>
      <p>Details about Model {id}.</p>
      <div>
        <h2>Add to Cart</h2>
        <button onClick={() => alert('Added Model ' + id + ' to cart!')}>Add to Cart</button>
      </div>
      <Link to="/checkout"><button>Go to Checkout</button></Link>
    </div>
  );
};

export default ModelDetail;
