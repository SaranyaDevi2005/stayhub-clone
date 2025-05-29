import React, { useEffect, useState } from "react";

function MyBookings() {
  const [bookedListings, setBookedListings] = useState([]);

  useEffect(() => {
    const fetchBookedListings = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/listings/booked", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errData = await res.json();
          console.error("Error fetching booked listings:", errData.message);
          setBookedListings([]);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setBookedListings(data);
        } else {
          console.error("Expected array but got:", data);
          setBookedListings([]);
        }
      } catch {
        setBookedListings([]);
      }
    };

    fetchBookedListings();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4" style={{ color: "#e63946" }}>My Bookings</h2>
      {bookedListings.length === 0 ? (
        <p className="text-center">You have no bookings yet.</p>
      ) : (
        <div className="row">
          {bookedListings.map((listing) => (
            <div key={listing._id} className="col-md-6 col-lg-4 mb-4">
              <div
                className="card shadow-sm h-100"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd"
                }}
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="card-img-top"
                  style={{
                    height: "180px",
                    objectFit: "cover",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title" style={{ color: "#1d3557" }}>{listing.title}</h5>
                  <p className="card-text mb-1">
                    <strong>Location:</strong> {listing.location}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Price:</strong> ₹{listing.price}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Availability:</strong> {listing.availability}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Description:</strong> {listing.description}
                  </p>
                  <p className="card-text mb-0">
                    <strong>Amenities:</strong> {listing.amenities?.join(", ")}
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

export default MyBookings;
