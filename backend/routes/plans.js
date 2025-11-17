import express from "express";
import TripPlan from "../models/TripPlan.js";
import Place from "../models/Place.js";
import City from "../models/City.js";

const router = express.Router();

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Simple route optimization (Nearest Neighbor)
function optimizeRoute(places, startLat, startLong) {
  if (places.length === 0) return [];

  const unvisited = [...places];
  const optimized = [];

  // Start from the first place or find nearest to center
  let current = unvisited.reduce((nearest, place) => {
    const nearestDist = calculateDistance(
      startLat,
      startLong,
      nearest.lat,
      nearest.long
    );
    const currentDist = calculateDistance(
      startLat,
      startLong,
      place.lat,
      place.long
    );
    return currentDist < nearestDist ? place : nearest;
  }, unvisited[0]);

  // Remove current from unvisited and add to optimized
  const currentIndex = unvisited.findIndex(
    (p) => p._id.toString() === current._id.toString()
  );
  unvisited.splice(currentIndex, 1);
  optimized.push(current);

  while (unvisited.length > 0) {
    // Find nearest unvisited place
    let nearestIndex = 0;
    let minDistance = calculateDistance(
      current.lat,
      current.long,
      unvisited[0].lat,
      unvisited[0].long
    );

    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(
        current.lat,
        current.long,
        unvisited[i].lat,
        unvisited[i].long
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    current = unvisited[nearestIndex];
    optimized.push(current);
    unvisited.splice(nearestIndex, 1);
  }

  return optimized;
}

// Create trip plan
router.post("/", async (req, res) => {
  try {
    const { cityId, placeIds, mileage = 40, petrolPrice = 105 } = req.body;

    // Get place details
    const places = await Place.find({ _id: { $in: placeIds } });
    if (places.length === 0) {
      return res.status(400).json({ message: "No places selected" });
    }

    // Get city for center coordinates
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    // Optimize route
    const optimizedPlaces = optimizeRoute(
      places,
      city.centerLat,
      city.centerLong
    );

    // Calculate totals
    let totalDistance = 0;
    let totalTime = 0;
    let totalEntryFee = 0;

    // Calculate distances between optimized places
    for (let i = 0; i < optimizedPlaces.length - 1; i++) {
      const distance = calculateDistance(
        optimizedPlaces[i].lat,
        optimizedPlaces[i].long,
        optimizedPlaces[i + 1].lat,
        optimizedPlaces[i + 1].long
      );
      totalDistance += distance;
    }

    // Add visiting times and entry fees
    optimizedPlaces.forEach((place) => {
      totalTime += place.visitingTime;
      totalEntryFee += place.entryFee;
    });

    // Add some buffer time for travel (30 mins between places)
    totalTime += (optimizedPlaces.length - 1) * 30;

    const petrolNeeded = totalDistance / mileage;
    const petrolCost = petrolNeeded * petrolPrice;

    // Create trip plan
    const tripPlan = new TripPlan({
      cityId,
      places: optimizedPlaces.map((place, index) => ({
        placeId: place._id,
        order: index,
        visitingTime: place.visitingTime,
        entryFee: place.entryFee,
      })),
      totalDistance: parseFloat(totalDistance.toFixed(2)),
      totalTime,
      petrolNeeded: parseFloat(petrolNeeded.toFixed(2)),
      petrolCost: parseFloat(petrolCost.toFixed(2)),
      mileage,
      petrolPrice,
      optimizedRoute: optimizedPlaces.map((place) => ({
        lat: place.lat,
        long: place.long,
        placeId: place._id,
      })),
    });

    const savedPlan = await tripPlan.save();
    await savedPlan.populate("places.placeId");
    await savedPlan.populate("cityId");

    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trip plan by short ID
router.get("/:shortId", async (req, res) => {
  try {
    const plan = await TripPlan.findOne({ shortId: req.params.shortId })
      .populate("places.placeId")
      .populate("cityId");

    if (!plan) {
      return res.status(404).json({ message: "Trip plan not found" });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
