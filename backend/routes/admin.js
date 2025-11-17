import express from "express";
import City from "../models/City.js";
import Place from "../models/Place.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as admin" });
  }
};

// City management
router.post("/cities", admin, async (req, res) => {
  try {
    const city = new City(req.body);
    const savedCity = await city.save();
    res.status(201).json(savedCity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/cities/:id", admin, async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/cities/:id", admin, async (req, res) => {
  try {
    await City.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "City deactivated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Place management
router.post("/places", admin, async (req, res) => {
  try {
    const place = new Place(req.body);
    const savedPlace = await place.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/places/:id", admin, async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/places/:id", admin, async (req, res) => {
  try {
    await Place.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Place deactivated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
