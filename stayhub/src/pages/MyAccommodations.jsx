import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyAccommodations() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/listings/mine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error("Error fetching listings:", errData.message);
          setListings([]);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setListings(data);
        } else {
          console.error("Expected array but got:", data);
          setListings([]);
        }
      } catch (err) {
        console.error("Network error:", err);
        setListings([]);
      }
    };

    fetchListings();
  }, []);

  const handleEdit = (id) => {
    navigate(`/editlisting/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setListings((prev) => prev.filter((listing) => listing._id !== id));
        alert("Listing deleted successfully");
      } else {
        const errorData = await res.json();
        alert("Failed to delete listing: " + (errorData.message || ""));
      }
    } catch (err) {
      console.error("Error deleting listing:", err);
      alert("Network error while deleting listing");
    }
    
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4" style={{ color: "#e63946" }}>My Accommodations</h2>

      {listings.length === 0 ? (
        <p className="text-center">You have no listings yet.</p>
      ) : (
        <div className="row">
          {listings.map((listing) => (
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
                  <button
                    onClick={() => handleEdit(listing._id)}
                    className="btn btn-primary mt-3 me-2"
                    style={{ backgroundColor: "#e63946", border: "none" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="btn btn-danger mt-3"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAccommodations;
