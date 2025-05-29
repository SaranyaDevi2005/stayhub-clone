import React, { useEffect, useState } from "react";
import StayCard from "../components/StayCard";

function Home({ searchTerm }) {
  const [stays, setStays] = useState([]);

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setStays(data);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });
  }, []);

  const filteredStays = stays.filter((stay) =>
    stay.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stay.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <h2>Explore Places</h2>
      <div className="stay-grid">
        {filteredStays.map((stay) => (
          <StayCard key={stay._id} stay={stay} />
        ))}
      </div>
    </div>
  );
}

export default Home;
