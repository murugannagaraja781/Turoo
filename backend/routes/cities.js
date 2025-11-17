import express from "express";
import City from "../models/City.js";

const router = express.Router();

// Get all cities

router.get("/", async (req, res) => {
  try {
    const cities = await City.find({ isActive: true });
    console.log("Cities fetched:", cities);
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single city
router.get("/:id", async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
