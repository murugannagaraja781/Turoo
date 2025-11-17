import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import CityPlaces from "./pages/CityPlaces";
import TripPlanner from "./pages/TripPlanner";
// import TripSummary from "./pages/TripSummary";
import SharePlan from "./pages/SharePlan";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/city/:cityId" element={<CityPlaces />} />
              <Route path="/plan/:cityId" element={<TripPlanner />} />
              <Route path="/share/:shortId" element={<SharePlan />} />
              <Route path="/admin" element={<Admin />} />
              {/*

              <Route path="/trip/:tripId" element={<TripSummary />} />



             */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
