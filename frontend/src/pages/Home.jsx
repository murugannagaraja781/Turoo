import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosConfig";

const Home = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "https://turoo.onrender.com";
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/cities`);
      console.log("res", response);
      // setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading cities...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Turoo
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Plan your perfect trip with intelligent route optimization and cost
          calculations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cities &&
          cities.map((city) => (
            <div
              key={city._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={city.heroImage}
                alt={city.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {city.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {city.description}
                </p>
                <Link
                  to={`/city/${city._id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 w-full text-center block"
                >
                  Explore Places
                </Link>
              </div>
            </div>
          ))}
      </div>

      {cities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No cities available yet.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
