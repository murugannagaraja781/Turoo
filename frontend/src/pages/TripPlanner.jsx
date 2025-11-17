import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";

const TripPlanner = () => {
  const { cityId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mileage, setMileage] = useState(40);
  const [petrolPrice, setPetrolPrice] = useState(105);

  useEffect(() => {
    const initialSelected = location.state?.selectedPlaces || [];
    setSelectedPlaces(initialSelected);
    fetchCityAndPlaces();
  }, [cityId, location]);

  const fetchCityAndPlaces = async () => {
    try {
      const [cityResponse, placesResponse] = await Promise.all([
        axios.get(`/api/cities/${cityId}`),
        axios.get(`/api/places/city/${cityId}`),
      ]);
      setCity(cityResponse.data);
      setPlaces(placesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generatePlan = async () => {
    if (selectedPlaces.length === 0) {
      alert("Please select at least one place");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/plans", {
        cityId,
        placeIds: selectedPlaces,
        mileage,
        petrolPrice,
      });
      setTripPlan(response.data);
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Failed to generate trip plan");
    } finally {
      setLoading(false);
    }
  };

  const saveAndShare = () => {
    if (tripPlan) {
      navigate(`/trip/${tripPlan._id}`);
    }
  };

  const getSelectedPlaceDetails = () => {
    return places.filter((place) => selectedPlaces.includes(place._id));
  };

  const selectedPlaceDetails = getSelectedPlaceDetails();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Planner</h1>
        {city && (
          <p className="text-gray-600">Planning your trip to {city.name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Selected Places ({selectedPlaces.length})
            </h2>
            <div className="space-y-3">
              {selectedPlaceDetails.map((place) => (
                <div
                  key={place._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <h3 className="font-medium">{place.name}</h3>
                    <p className="text-sm text-gray-500">
                      {place.visitingTime} min • ₹{place.entryFee} •{" "}
                      {place.distanceFromCenter} km
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedPlaces((prev) =>
                        prev.filter((id) => id !== place._id)
                      )
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {selectedPlaces.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No places selected. Go back to select places.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Trip Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Mileage (km/L)
                </label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Petrol Price (₹/L)
                </label>
                <input
                  type="number"
                  value={petrolPrice}
                  onChange={(e) => setPetrolPrice(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Generate Plan</h2>
            <button
              onClick={generatePlan}
              disabled={loading || selectedPlaces.length === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate Smart Route"}
            </button>
          </div>

          {tripPlan && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Trip Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Distance:</span>
                  <span className="font-medium">
                    {tripPlan.totalDistance} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Time:</span>
                  <span className="font-medium">
                    {Math.floor(tripPlan.totalTime / 60)}h{" "}
                    {tripPlan.totalTime % 60}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Petrol Needed:</span>
                  <span className="font-medium">{tripPlan.petrolNeeded}L</span>
                </div>
                <div className="flex justify-between">
                  <span>Petrol Cost:</span>
                  <span className="font-medium">₹{tripPlan.petrolCost}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Total Entry Fees:</span>
                  <span className="font-medium">
                    ₹
                    {tripPlan.places.reduce(
                      (sum, place) => sum + place.entryFee,
                      0
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={saveAndShare}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 w-full mt-4"
              >
                Save & View Full Plan
              </button>
            </div>
          )}

          {tripPlan?.places && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="font-semibold mb-3">Optimized Route</h3>
              <ol className="list-decimal list-inside space-y-2">
                {tripPlan.places
                  .sort((a, b) => a.order - b.order)
                  .map((place) => (
                    <li key={place.placeId._id} className="text-sm">
                      {place.placeId.name} ({place.visitingTime} min)
                    </li>
                  ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
