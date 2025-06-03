import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../styles/BookingConfirmation.css';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get carImage from navigation state, fallback to a default image if not present
  const carImage = location.state?.carImage || '/images/default_car.jpg';

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`https://rentro-backend.onrender.com/api/bookings/${bookingId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching booking");
        setBooking(data.booking);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <div className="loading-container">Loading booking details...</div>;
  if (error || !booking) return <div className="error-container">{error || "Booking not found"}</div>;

  return (
    <div className="booking-confirmation">
      <h1>Booking Confirmation</h1>
      <div className="car-summary">
        <img 
          src={carImage} 
          alt={booking.car} 
          className="car-image"
          onError={e => { e.target.onerror = null; e.target.src = '/images/default_car.jpg'; }}
        />
        <h2>{booking.car}</h2>
        <p><strong>Price:</strong> ₹{booking.totalCost.toLocaleString()}</p>
      </div>
      <div className="customer-details">
        <h3>Your Booking Details</h3>
        <p><strong>Name:</strong> {booking.name}</p>
        <p><strong>Email:</strong> {booking.email}</p>
        <p><strong>Phone:</strong> {booking.phone}</p>
        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Color:</strong> {booking.color}</p>
        <p><strong>Comments:</strong> {booking.comments}</p>
      </div>
      <div className="status-section">
        <h3>Booking Status</h3>
        <p>{booking.status === 1 ? "Confirmed" : "Pending"}</p>
        <h3>Payment</h3>
        <p>Status: Paid</p>
        <p>Amount: ₹{booking.totalCost.toLocaleString()}</p>
      </div>
      <button className="go-home-btn" onClick={() => navigate("/")}>
        Go Back to Home
      </button>
    </div>
  );
};

export default BookingConfirmation;
