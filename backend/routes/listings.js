const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const User = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");

// Create a new listing
router.post("/", authenticateToken, async (req, res) => {
  try {
    console.log("Incoming data:", req.body);
    console.log("Authenticated user:", req.user);

    const listing = new Listing({
      ...req.body,
      userId: req.user.id, // Make sure req.user exists!
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    console.error("Error creating listing:", err); // Log the full error
    res.status(500).json({ message: "Failed to create listing", error: err.message });
  }
});

// Update a listing by ID
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this listing" });
    }

    Object.assign(listing, req.body);
    await listing.save();
    res.json(listing);
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).json({ message: "Failed to update listing", error: err.message });
  }
});

// GET /api/listings/booked - Get listings booked by the user
router.get("/booked", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: 'bookings',
      model: 'Listing'
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const bookedListings = user.bookings || [];
    res.json(bookedListings);
  } catch (err) {
    console.error("Failed to fetch booked listings:", err.stack || err);
    res.status(500).json({ message: "Failed to fetch booked listings", error: err.message });
  }
});

// GET /api/listings/mine
router.get("/mine", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const listings = await Listing.find({ userId }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error("Failed to fetch user's listings:", err.stack || err);
    res.status(500).json({ message: "Failed to fetch listing", error: err.message });
  }
});

// Fetch one listing by ID
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    console.error("Error fetching listing by ID:", err);
    res.status(500).json({ message: "Failed to fetch listing", error: err.message });
  }
});

// GET /api/listings
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 }); // Latest first
    console.log("Fetched listings:", listings.length);
    res.json(listings);
  } catch (err) {
    console.error("Failed to fetch listings:", err.stack || err);
    res.status(500).json({ message: "Failed to fetch listings", error: err.message });
  }
});

router.post("/:id/book", authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.availability <= 0) {
      return res.status(400).json({ message: "No availability left for this listing" });
    }
    listing.availability -= 1;
    await listing.save();

    // Add listing to user's bookings
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.bookings) {
      user.bookings = [];
    }
    user.bookings.push(listing._id);
    await user.save();

    res.json({ message: "Booking successful", listing });
  } catch (err) {
    console.error("Error booking listing:", err);
    res.status(500).json({ message: "Failed to book listing", error: err.message });
  }
});

// Delete a listing by ID
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this listing" });
    }
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("Error deleting listing:", err);
    res.status(500).json({ message: "Failed to delete listing", error: err.message });
  }
});

module.exports = router;
