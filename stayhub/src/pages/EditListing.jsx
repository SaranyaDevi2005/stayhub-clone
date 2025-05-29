import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditListing.css"; // Assuming you have a CSS file for styling



function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    price: "",
    location: "",
    amenities: "",
    availability: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/listings/${id}`);
        if (!res.ok) {
          setError("Failed to fetch listing data");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setFormData({
          title: data.title || "",
          image: data.image || "",
          description: data.description || "",
          price: data.price || "",
          location: data.location || "",
          amenities: data.amenities ? data.amenities.join(", ") : "",
          availability: data.availability || 1,
        });
        setLoading(false);
      } catch {
        setError("Network error while fetching listing");
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const formattedData = {
        ...formData,
        price: Number(formData.price),
        availability: Number(formData.availability),
        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      };

      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (res.ok) {
        alert("Listing updated successfully!");
        navigate("/myaccommodations");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to update listing");
      }
    } catch {
      setError("Network error while updating listing");
    }
  };

  if (loading) return <p>Loading listing data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="edit-listing-container">
      <h2>Edit Listing</h2>
      <form onSubmit={handleSubmit} className="listing-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Luxury City Loft"
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Modern loft in the heart of the city with all premium facilities."
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price per night (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 3000"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Bangalore"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Amenities</label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="e.g., Gym, High-Speed WiFi, Workspace, Smart TV"
          />
        </div>

        <div className="form-group">
          <label>Availability (number of units)</label>
          <input
            type="number"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Update Listing
        </button>
      </form>
    </div>
  );
}

export default EditListing;
