import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SharePlan = () => {
  const { shortId } = useParams();
  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "https://turoo.onrender.com";

  useEffect(() => {
    fetchTripPlan();
  }, [shortId]);

  const fetchTripPlan = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/plans/${shortId}`);
      setTripPlan(response.data);
    } catch (error) {
      console.error("Error fetching shared plan:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading shared plan...
      </div>
    );
  if (!tripPlan)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Trip plan not found
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Shared Trip Plan
        </h1>
        <p className="text-gray-600">
          {tripPlan.cityId?.name} • {tripPlan.places.length} places • Planned
          with Turoo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Day Plan</h2>
            <div className="space-y-4">
              {tripPlan.places
                .sort((a, b) => a.order - b.order)
                .map((place, index) => (
                  <div
                    key={place.placeId._id}
                    className="flex items-start space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {place.placeId.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {place.placeId.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500">
                        <div>Time: {place.visitingTime} min</div>
                        <div>Entry: ₹{place.entryFee}</div>
                        <div>
                          Distance: {place.placeId.distanceFromCenter} km
                        </div>
                        <div>Category: {place.placeId.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Trip Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Distance:</span>
                <span className="font-medium">{tripPlan.totalDistance} km</span>
              </div>
              <div className="flex justify-between">
                <span>Total Time:</span>
                <span className="font-medium">
                  {Math.floor(tripPlan.totalTime / 60)}h{" "}
                  {tripPlan.totalTime % 60}m
                </span>
              </div>
              <div className="flex justify-between">
                <span>Fuel Cost:</span>
                <span className="font-medium">₹{tripPlan.petrolCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Entry Fees:</span>
                <span className="font-medium">
                  ₹
                  {tripPlan.places.reduce(
                    (sum, place) => sum + place.entryFee,
                    0
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total Cost:</span>
                <span>
                  ₹
                  {tripPlan.petrolCost +
                    tripPlan.places.reduce(
                      (sum, place) => sum + place.entryFee,
                      0
                    )}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
            <h3 className="font-semibold mb-2">Create Your Own Plan</h3>
            <p className="text-gray-600 text-sm mb-4">
              Plan your perfect trip with intelligent route optimization
            </p>
            <a
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-block"
            >
              Start Planning
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePlan;
