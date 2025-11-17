import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("cities");
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "cities") {
        const response = await axios.get("/api/cities");
        setCities(response.data);
      } else {
        const response = await axios.get("/api/places/city/all");
        setPlaces(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("cities")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "cities"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Cities
          </button>
          <button
            onClick={() => setActiveTab("places")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "places"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Places
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "cities" && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Cities Management</h2>
            <button className="btn-primary">Add New City</button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading cities...</div>
          ) : (
            <div className="space-y-4">
              {cities.map((city) => (
                <div
                  key={city._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{city.name}</h3>
                    <p className="text-gray-600 text-sm">{city.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm">Edit</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "places" && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Places Management</h2>
            <button className="btn-primary">Add New Place</button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading places...</div>
          ) : (
            <div className="space-y-4">
              {places.map((place) => (
                <div
                  key={place._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{place.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-1">
                        {place.description}
                      </p>
                      <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                        <span>Time: {place.visitingTime}min</span>
                        <span>Fee: ₹{place.entryFee}</span>
                        <span>Dist: {place.distanceFromCenter}km</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm">Edit</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
