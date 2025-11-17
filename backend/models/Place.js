import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    distanceFromCenter: {
      type: Number,
      required: true,
    },
    visitingTime: {
      type: Number, // in minutes
      required: true,
    },
    entryFee: {
      type: Number,
      default: 0,
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["historical", "religious", "natural", "adventure", "cultural"],
      default: "historical",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Place", placeSchema);
