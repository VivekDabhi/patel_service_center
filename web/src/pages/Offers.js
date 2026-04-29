import { useState, useEffect } from 'react';
import api from '../api';

export default function Offers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => { api.get('/api/offers/').then(r => setOffers(r.data)); }, []);

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">🎉 Current Offers & Discounts</h3>
      {offers.length === 0 ? (
        <div className="alert alert-info">No active offers at the moment. Check back soon!</div>
      ) : (
        <div className="row g-4">
          {offers.map(offer => (
            <div className="col-md-4" key={offer.id}>
              <div className="card border-danger border-2 h-100">
                <div className="card-body">
                  <h5 className="fw-bold text-danger">{offer.title}</h5>
                  <p className="text-muted">{offer.description}</p>
                  {offer.discount_percent && (
                    <span className="badge bg-danger fs-6">{offer.discount_percent}% OFF</span>
                  )}
                  {offer.discount_amount && (
                    <span className="badge bg-danger fs-6">₹{offer.discount_amount} OFF</span>
                  )}
                  <p className="text-muted small mt-2 mb-0">
                    Valid until: {new Date(offer.valid_until).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
