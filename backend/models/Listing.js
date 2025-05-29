const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  price: Number,
  location: String,
  amenities: [String],
  availability: {
    type: Number,
    required: true,
    default: 1
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Listing", listingSchema);
