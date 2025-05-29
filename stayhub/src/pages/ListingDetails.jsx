import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DateRange } from "react-date-range";
import { differenceInCalendarDays } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function ListingDetails() {
  const { id } = useParams();
  const [stay, setStay] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/listings/${id}`)
      .then(res => res.json())
      .then(data => {
        setStay(data);
        setFetchError(""); // Clear any previous errors
      })
      .catch(() => {
        console.error("Error fetching listing details");
        setFetchError("Failed to load listing details.");
      });
  }, [id]);

  if (fetchError) return <p style={{ color: "red" }}>{fetchError}</p>;
  if (!stay) return <p>Loading...</p>;

  const nights = differenceInCalendarDays(
    dateRange[0].endDate,
    dateRange[0].startDate
  );
  const total = nights > 0 ? nights * stay.price : stay.price;

  const handleReserve = async () => {
    setErrorMessage("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/listings/${id}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setShowSuccess(true);
        setStay(prev => ({ ...prev, availability: prev.availability - 1 }));
        setTimeout(() => {
          setShowSuccess(false);
          setDateRange([{
            startDate: new Date(),
            endDate: new Date(),
            key: "selection"
          }]);
        }, 3000);
      } else {
        setErrorMessage(data.message || "Booking failed");
      }
    } catch {
      setErrorMessage("Booking failed due to network error");
    }
  };

  return (
    <div className="listing-details" style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", position: "relative" }}>
      <h2>{stay.title}</h2>
      <img
        src={stay.image}
        alt={stay.title}
        style={{ width: "100%", height: "auto", borderRadius: "12px", marginBottom: "20px" }}
      />
      <p><strong>Description:</strong> {stay.description}</p>
      <p><strong>Price per night:</strong> ₹{stay.price}</p>
      <p><strong>Location:</strong> {stay.location}</p>
      <p><strong>Amenities:</strong> {stay.amenities?.join(", ")}</p>
      <p><strong>Availability:</strong> {stay.availability}</p>

      <h3 style={{ marginTop: "30px" }}>Select Stay Dates</h3>
      <DateRange
        editableDateInputs={true}
        onChange={item => setDateRange([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={dateRange}
      />

      <h3 style={{ marginTop: "20px" }}>Total Price: ₹{total}</h3>

      <button
        onClick={handleReserve}
        disabled={stay.availability <= 0}
        style={{
          backgroundColor: stay.availability <= 0 ? "#ccc" : "#e63946",
          color: stay.availability <= 0 ? "#666" : "white",
          padding: "12px 24px",
          fontSize: "16px",
          border: "none",
          borderRadius: "8px",
          cursor: stay.availability <= 0 ? "not-allowed" : "pointer",
          marginTop: "20px",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={e => {
          if (stay.availability > 0) e.currentTarget.style.backgroundColor = "#d62828";
        }}
        onMouseOut={e => {
          if (stay.availability > 0) e.currentTarget.style.backgroundColor = "#e63946";
        }}
      >
        {stay.availability <= 0 ? "Sold Out" : "Reserve"}
      </button>

      {errorMessage && (
        <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
      )}

      {showSuccess && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "16px",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
            animation: "pop 0.3s ease-in-out"
          }}>
            <div style={{ fontSize: "64px", color: "green" }}>✅</div>
            <h2 style={{ marginTop: "10px", fontSize: "24px" }}>Successfully Booked!</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListingDetails;
