import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axiosConfig";

const CityPlaces = () => {
  const { cityId } = useParams();
  const [city, setCity] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCityAndPlaces();
  }, [cityId]);

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
    } finally {
      setLoading(false);
    }
  };

  const togglePlaceSelection = (placeId) => {
    const newSelected = new Set(selectedPlaces);
    if (newSelected.has(placeId)) {
      newSelected.delete(placeId);
    } else {
      newSelected.add(placeId);
    }
    setSelectedPlaces(newSelected);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {city && (
        <div className="mb-8">
          <img
            src={city.heroImage}
            alt={city.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{city.name}</h1>
          <p className="text-gray-600 text-lg">{city.description}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Tourist Places ({places.length})
        </h2>
        {selectedPlaces.size > 0 && (
          <Link
            to={`/plan/${cityId}`}
            state={{ selectedPlaces: Array.from(selectedPlaces) }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Plan Trip ({selectedPlaces.size} places selected)
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <div
            key={place._id}
            className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedPlaces.has(place._id)
                ? "ring-2 ring-blue-500 border-blue-500"
                : "hover:shadow-lg"
            }`}
            onClick={() => togglePlaceSelection(place._id)}
          >
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {place.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {place.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-3">
                <div>
                  <span className="font-medium">Distance:</span>{" "}
                  {place.distanceFromCenter} km
                </div>
                <div>
                  <span className="font-medium">Time:</span>{" "}
                  {place.visitingTime} min
                </div>
                <div>
                  <span className="font-medium">Entry Fee:</span> ₹
                  {place.entryFee}
                </div>
                <div>
                  <span className="font-medium">Category:</span>{" "}
                  {place.category}
                </div>
              </div>

              <div
                className={`text-sm font-medium ${
                  selectedPlaces.has(place._id)
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {selectedPlaces.has(place._id)
                  ? "✓ Selected"
                  : "Click to select"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {places.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No places available in this city yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default CityPlaces;
