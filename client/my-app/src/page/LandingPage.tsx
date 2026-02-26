import React, { useEffect } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import LandingFooter from '../components/LandingFooter';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "admin") navigate("/admin");
      else navigate("/course");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 font-sans text-slate-900 overflow-hidden">

      <LandingNavbar />

      <section className="max-w-7xl mx-auto px-8 py-16 items-center relative">

        
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 opacity-20 blur-3xl rounded-full"></div>

        <div className="space-y-8 relative z-10">

          <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm backdrop-blur-md">
            ● New Courses Available
          </div>

          <h1 className="text-6xl font-extrabold leading-tight">
            Empower Your Future with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Courses
            </span>
          </h1>

          <p className="text-slate-600 text-xl max-w-lg leading-relaxed">
            Access world-class training and industry-recognized certifications.
            Start your journey today.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/login")}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-blue-300"
            >
              Get Started
              <HiArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>

        </div>

      </section>

      <LandingFooter />
      
    </div>
  );
};

export default LandingPage;