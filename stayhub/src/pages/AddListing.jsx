import React, { useState } from "react";
import "./AddListing.css"; // Import your styles

function AddListing() {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    price: "",
    location: "",
    amenities: "",
    availability: 1,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // Format amenities to array
      const formattedData = {
        ...formData,
        price: Number(formData.price), // Ensure price is number
        availability: Number(formData.availability), // Ensure availability is number
        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item), // Remove empty strings
      };

      const res = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (res.ok) {
        alert("Listing added successfully!");
        // Reset the form
        setFormData({
          title: "",
          image: "",
          description: "",
          price: "",
          location: "",
          amenities: "",
          availability: 1,
        });
        window.location.href = "/"; // Optional: redirect to home
      } else {
        const errorData = await res.json();
        alert("Error: " + errorData.message);
      }
    } catch (err) {
      console.error("Error adding listing:", err);
      alert("An error occurred while adding the listing.");
    }
  };

  return (
    <div className="add-listing-container">
      <div className="form-box">
        <h2 className="form-title">Add a New Stay</h2>
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
            Submit Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddListing;
