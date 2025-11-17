import express from "express";
import Place from "../models/Place.js";

const router = express.Router();

// Get places by city
router.get("/city/:cityId", async (req, res) => {
  try {
    const places = await Place.find({
      cityId: req.params.cityId,
      isActive: true,
    }).populate("cityId");
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single place
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate("cityId");
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get nearby places
router.get("/nearby/:placeId", async (req, res) => {
  try {
    const currentPlace = await Place.findById(req.params.placeId);
    if (!currentPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    const nearbyPlaces = await Place.find({
      cityId: currentPlace.cityId,
      _id: { $ne: currentPlace._id },
      isActive: true,
    }).limit(5);

    res.json(nearbyPlaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
