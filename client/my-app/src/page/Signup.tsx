import React, { useState, useEffect, type ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HiArrowNarrowLeft, HiEye } from "react-icons/hi"; // Added Eye icon for visual match

export const Signup: React.FC = () => { 
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", 
  });

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "admin") navigate("/admin");
      else navigate("/course");
    }
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      
      const response = await axios.post(
        "https://d67jtv7w-5000.inc1.devtunnels.ms/register",
        formData
      );
      if ( response.status === 201) {
        
        setFormData({ 
            name: "", 
            email: "", 
            password: "", 
            role: "student" 
        });
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0a192f] bg-gradient-to-br from-[#112240] via-[#0a192f] to-[#020c1b] relative font-sans">

      
      <div 
        onClick={() => navigate("/")} 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400  cursor-pointer transition-colors"
      >
        <HiArrowNarrowLeft />
        <span className="text-xs font-bold uppercase tracking-widest">Go Back</span>
      </div>
      
      {/* <div className="w-full max-w-lg  rounded-3xl bg-[#112240]/80 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">  */}

      <div className="w-full max-w-lg rounded-[40px] bg-[#0d1b31] border border-white/5 shadow-2xl overflow-hidden mt-8" >

  

        <div className="flex flex-col items-center pt-11 pb-4  px-8 border-b border-white/5">
          <h1 className="text-3xl font-bold text-blue-600  mb-2 text-center leading-snug">Welcome !! </h1>
          <p className="text-2xl  font-semibold text-center">Sign up </p>
        </div>

        <div className="px-10 flex flex-col gap-6 pt-6">
                 
          
          <div className="flex flex-col gap-1.5">
           <label className="text-md   text-gray-500 ">Full Name</label>
            <input
              type="text"
              placeholder="Enter Your Name..."
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#1d2d44] border border-white/5 rounded-xl py-3 px-5 text-sm text-black placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          
          <div className="flex flex-col gap-1.5">
            <label className="text-md   text-gray-500 ">Email Address</label>
            <input
              type="email"
              placeholder="Enter Your Email..."
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#1d2d44] border border-white/5 rounded-xl py-3 px-5 text-sm text-black placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>

          
          <div className="flex gap-3">
             <div className="flex flex-col gap-1.5 w-1/2">
                <label className="text-md   text-gray-500 ">Password</label>
                <div className="relative">
                    <input
                        type="password"
                        placeholder="********"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-[#1d2d44] border border-white/5 rounded-xl py-3 px-5 text-sm text-black placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                    
                </div>
             </div>
             
             
             <div className="flex flex-col gap-1.5 w-1/2">
               <label className="text-md   text-gray-500 ">Role</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-[#1d2d44] border border-white/5 rounded-xl py-3 px-5 text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                </select>
             </div>
          </div>

        </div>

        
        <div className="px-10 mt-8 mb-4 ">
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full py-3 rounded-full bg-blue-500 text-white font-medium text-md  hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 hover:bg-blue-400 transition-colors"
          >
            Create Account
          </button>
        </div>

        
        <div className="py-6 text-center bg-black/20">
          <span className="text-xl text-slate-400">
            or{" "}
            <span 
                onClick={() => navigate("/login")} 
                className="text-blue-500 cursor-pointer hover:underline font-semibold"
            >
                log in
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};