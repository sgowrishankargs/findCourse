import React, { useState, useEffect, type ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { FiEdit3 } from 'react-icons/fi';
import { HiArrowNarrowLeft } from "react-icons/hi";

interface CourseData {
  course_title: string;
  course_instructor: string;
  course_description: string;
  course_duration: string;
  course_modules: string;
  course_price: string;
}

export const AddCourse: React.FC = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState<CourseData>({
    course_title: '',
    course_instructor: '',
    course_description: '',
    course_duration: '',
    course_modules: '',
    course_price: '',
  });

  const [loading, setLoading] = useState<boolean>(false);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostData = async () => {
    if (!formData.course_title || !formData.course_instructor) {
      alert("Please fill in the required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        'http://localhost:5000/course-register', 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 201 ) {
        alert("Data Saved Successfully!");
        setFormData({
            course_title: '',
            course_instructor: '',
            course_description: '',
            course_duration: '',
            course_modules: '',
            course_price: '',
        });
        navigate("/admin");
      }
    } catch (error: any) {
      console.error(error);
      if ( error.response?.status === 401) {
        alert("Unauthorized! Please login again.");
        localStorage.clear();
        navigate("/login");
      } else {
        alert("Error saving data: " + (error.response?.data?.error || "Server error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 relative">

          <div onClick={() => navigate("/admin")} 
               className="flex items-center gap-1 text-slate-400  cursor-pointer transition-colors"
          >
             <HiArrowNarrowLeft />
             <span className="text-xs font-bold uppercase tracking-widest">
              Go Back
             </span>
          </div>

      <div className="max-w-2xl mx-auto">
        

        <div className='flex justify-between items-center mb-8'>

           <h2 className="text-2xl text-slate-800 flex items-center gap-3">
              <FiEdit3 className="text-blue-600" /> Post New Course
           </h2>



        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 md:p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest text-slate-400 ml-2">
              Course Title
            </label>

            <input type="text"
                   name="course_title"
                   value={formData.course_title} 
                   onChange={handleChange} 
                   className="w-full border bg-slate-50 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest text-slate-400 ml-2">
              Course Instructor
            </label>

            <input type="text" 
                   name="course_instructor" 
                   value={formData.course_instructor} 
                   onChange={handleChange} 
                   className="w-full border bg-slate-50 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest text-slate-400 ml-2">
              Course Description
            </label>

            <textarea name="course_description" rows={3} 
                      value={formData.course_description} 
                      onChange={handleChange} 
                      className="w-full border bg-slate-50 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-slate-400 ml-2">
                  Duration
              </label>

              <input type="text"
                     name="course_duration" 
                     value={formData.course_duration} 
                     onChange={handleChange} 
                     className="w-full border bg-slate-50 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>

           
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-slate-400 ml-2">
                Course Modules
              </label>

              <input type="text" 
                     name="course_modules" 
                     value={formData.course_modules} 
                     onChange={handleChange} 
                     className="w-full border bg-slate-50 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest text-slate-400 ml-2">
              Price (INR)
            </label>
            <input type="text" 
                   name="course_price" 
                   value={formData.course_price} 
                   onChange={handleChange} 
                   className="w-full border bg-slate-50 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>

          <div className="pt-4">
            <button onClick={handlePostData} 
                   disabled={loading} 
                   className="w-full bg-blue-600 text-white py-5 rounded-2xl font-semibold text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-70">
              {loading ? "Publishing..." : "Publish Course"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;