import mongoose from "mongoose";
import City from "../models/City.js";
import Place from "../models/Place.js";

const MONGODB_URI = "mongodb://localhost:27017/turoo";

const cities = [
  {
    name: "Tenkasi",
    description:
      "The Kashi of the South, known for its beautiful temples and waterfalls",
    heroImage:
      "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=800",
    centerLat: 8.96,
    centerLong: 77.3,
  },
  {
    name: "Madurai",
    description:
      "Ancient city with rich cultural heritage and magnificent temples",
    heroImage:
      "https://images.unsplash.com/photo-1593693397697-4f5e1d780c33?w=800",
    centerLat: 9.9252,
    centerLong: 78.1198,
  },
];

const tenkasiPlaces = [
  {
    name: "Tenkasi Temple",
    description: "Famous ancient temple dedicated to Lord Shiva",
    image: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=400",
    distanceFromCenter: 1.5,
    visitingTime: 60,
    entryFee: 0,
    lat: 8.9558,
    long: 77.315,
    category: "religious",
  },
  {
    name: "Courtallam Falls",
    description: "Beautiful waterfall known for its therapeutic properties",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400",
    distanceFromCenter: 6.0,
    visitingTime: 120,
    entryFee: 25,
    lat: 8.93,
    long: 77.27,
    category: "natural",
  },
  {
    name: "Five Falls",
    description: "Spectacular waterfall with five distinct cascades",
    image: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=400",
    distanceFromCenter: 8.0,
    visitingTime: 90,
    entryFee: 30,
    lat: 8.94,
    long: 77.25,
    category: "natural",
  },
  {
    name: "Sankarankovil Temple",
    description: "Ancient temple with unique architectural style",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
    distanceFromCenter: 15.0,
    visitingTime: 75,
    entryFee: 0,
    lat: 9.171,
    long: 77.549,
    category: "religious",
  },
  {
    name: "Kalakkad Mundanthurai Tiger Reserve",
    description: "Wildlife sanctuary with diverse flora and fauna",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400",
    distanceFromCenter: 25.0,
    visitingTime: 180,
    entryFee: 100,
    lat: 8.55,
    long: 77.45,
    category: "adventure",
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await City.deleteMany({});
    await Place.deleteMany({});

    // Insert cities
    const insertedCities = await City.insertMany(cities);
    console.log("Cities seeded...");

    // Get Tenkasi city ID
    const tenkasiCity = insertedCities.find((city) => city.name === "Tenkasi");

    // Insert places for Tenkasi
    const tenkasiPlacesWithCityId = tenkasiPlaces.map((place) => ({
      ...place,
      cityId: tenkasiCity._id,
    }));

    await Place.insertMany(tenkasiPlacesWithCityId);
    console.log("Places seeded...");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
