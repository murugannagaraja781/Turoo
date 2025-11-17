import mongoose from "mongoose";
import shortid from "shortid";

const tripPlanSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      default: shortid.generate,
      unique: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    places: [
      {
        placeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Place",
        },
        order: Number,
        visitingTime: Number,
        entryFee: Number,
      },
    ],
    totalDistance: {
      type: Number,
      required: true,
    },
    totalTime: {
      type: Number, // in minutes
      required: true,
    },
    petrolNeeded: {
      type: Number,
      required: true,
    },
    petrolCost: {
      type: Number,
      required: true,
    },
    mileage: {
      type: Number,
      default: 40,
    },
    petrolPrice: {
      type: Number,
      default: 105,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    optimizedRoute: [
      {
        lat: Number,
        long: Number,
        placeId: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TripPlan", tripPlanSchema);
