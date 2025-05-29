import { Link } from "react-router-dom";

function StayCard({ stay }) {
  return (
    <div className="stay-card">
      <img src={stay.image} alt={stay.title} />
      <h3>{stay.title}</h3>
      <p>{stay.location}</p>
      <p>₹{stay.price} / night</p>
      <Link to={`/listing/${stay._id}`}>
        <button className="view-details-btn">View Details</button>
      </Link>
    </div>
  );
}
export default StayCard;
