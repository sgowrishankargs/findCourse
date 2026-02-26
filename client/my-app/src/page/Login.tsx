import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HiArrowNarrowLeft } from "react-icons/hi"; 

interface LoginFormData {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Helper function to validate JWT token format
  const isValidToken = (token: string): boolean => {
    try {
      // JWT should have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Check if all parts are non-empty and have valid length
      return parts.every(part => part && part.length > 0);
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Only redirect if token is valid and role is set
    if (token && isValidToken(token) && role) {
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "student") {
        navigate("/course");
      }
    } else if (token && !isValidToken(token)) {
      // Clear invalid token
      localStorage.clear();
    }
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://d67jtv7w-5000.inc1.devtunnels.ms/login", formData);
      
      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userName", user.name);
       
        if (user.role === "admin") {
          navigate("/admin");
        } 
        else if (user.role === "student") {
          navigate("/course");
        }
        else {
          navigate("/");
        }
      }
    } 
    catch (error: any) {
      setError(error.response?.data?.error || "Invalid credentials");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a192f] bg-gradient-to-br from-[#122b54] via-[#0a192f] to-[#020c1b] relative font-sans">

      {/* Back Button */}
      <div 
          onClick={() => navigate("/")} 
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-400  cursor-pointer transition-colors"
        >
          <HiArrowNarrowLeft />
          <span className="text-xs font-bold uppercase tracking-widest">Go Back</span>
      </div>

      
      <div className="w-full max-w-md rounded-[40px] bg-[#0d1b31] border border-white/5 shadow-2xl overflow-hidden">
        
       <div className="flex flex-col items-center pt-11 pb-4 px-8 border-b border-white/5">
          <h1 className="text-3xl font-bold text-blue-600  mb-2 text-center leading-snug">Welcome Back !! </h1>
          <p className="text-2xl  font-semibold text-center">Login </p>
        </div>

        <form onSubmit={handleSubmit} className="px-10 mt-5 flex flex-col gap-5">

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-1.5">
            <label className="text-md   text-gray-500 ">Email Address</label>

            


            <input
              type="email"
              placeholder="Enter Your Email ..."
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#1c2b46] border  rounded-2xl py-3 pl-5 pr-12 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

         
          <div className="flex flex-col gap-1.5">
            <label className="text-md   text-gray-500 ">Password</label>
            
            <input
              type="password"
              placeholder="Enter Your Password ..."
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#1c2b46] border  rounded-2xl py-3 pl-5 pr-12 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
            
          </div>

          
          

          
          <div className="mt-4 mb-2">
            <button
              type="submit"
              disabled={loading}
               className="w-full py-3 rounded-full bg-blue-500 text-white font-medium text-md  hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 hover:bg-blue-400 transition-colors"
            >
              Log in
            </button>
          </div>
        </form>

        
        <div className="py-8 mt-6 text-center ">
          <span className="text-xl text-slate-500">
            or{" "}
            <span 
                onClick={() => navigate("/signup")} 
                 className="text-blue-500 cursor-pointer hover:underline font-semibold"
            >
                sign up
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};