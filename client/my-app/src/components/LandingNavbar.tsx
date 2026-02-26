import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingNavbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleRedirect = () => {
    if (role === "admin") navigate("/admin");
    else navigate("/course");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <span className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate("/")}>findCourse</span>
      <div className="flex items-center gap-4">
        {token ? (
          <button onClick={handleRedirect} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700">
            Go to Dashboard
          </button>
        ) : (
          <>
            <button onClick={() => navigate("/signup")} className="text-lg font-semibold px-4 py-2 hover:text-blue-600">Sign Up</button>
            <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-4 py-1 rounded-lg text-lg font-semibold shadow-lg shadow-blue-200">Login</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar;