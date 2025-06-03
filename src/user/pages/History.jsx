import React, { useEffect, useState } from 'react';
import '../styles/History.css';

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
      setError('User email not found in localStorage');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://rentro-backend.onrender.com/api/bookings/email/${userEmail}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');

      setBookings(data.bookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading booking history...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="history-container">
      <h1>Booking History</h1>
      {bookings.length === 0 ? (
        <p>No past bookings found.</p>
      ) : (
        <div className="history-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="history-card">
              <h3>{booking.name}</h3>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Car:</strong> {booking.car}</p>
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span></p>
              <p><strong>Total:</strong> ₹{booking.totalCost.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
