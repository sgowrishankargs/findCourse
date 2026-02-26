import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { getCoursesThunk, deleteCourseThunk } from '../redux/Slice/courseSlice';
import { HiOutlineLogout, HiPlus, HiSearch, HiOutlineTrash, HiOutlineAcademicCap } from 'react-icons/hi';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import LandingFooter from '../components/LandingFooter';

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, isAuthenticated } = useSelector((state: RootState) => state.courseData);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.clear();
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(getCoursesThunk());
    const intervalId = setInterval(() => {
      dispatch(getCoursesThunk());
    }, 5000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  const filteredCourses = courses.filter((course) => {
    const searchLower = debouncedSearch.toLowerCase();
    return (
      course.course_title.toLowerCase().includes(searchLower) ||
      course.course_instructor.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteCourseThunk(id));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-700">
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-slate-200">
          <h1 className="text-2xl font-bold text-blue-500">Admin Dashboard</h1>
          <button onClick={handleLogout}
                  className="text-slate-400 mr-10 hover:text-red-500 transition text-2xl">
                  <FiLogOut />
          </button>
        </header>

        <div className="p-8 space-y-8">


          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-600 m-3 ml-8 mt-8 mb-1">Course Management Dashboard</h2>
            </div>
            
          </div>

            <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-50">
              <div className="relative w-full max-w-md">
                <HiSearch className="absolute left-4 top-1/3 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search courses or instructors..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              
            <button 
              onClick={() => navigate("/addcourse")}
              className="bg-blue-600 text-white m-3 mt-3 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
            >
              <HiPlus size={20} /> Add New Course
            </button>
         

              
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-600 border-b border-slate-50 uppercase tracking-widest text-[12px]">
                  <tr>
                    <th className="px-6 py-4">Course Details</th>
                    <th className="px-6 py-4">Course Instructor</th>
                    <th className="px-6 py-4">Enrolled</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-10 font-medium text-slate-400">Loading courses...</td></tr>
                  ) : filteredCourses.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 font-medium text-slate-400">No courses found matching your search.</td></tr>
                  ) : (
                    filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl text-xl">
                              <HiOutlineAcademicCap />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{course.course_title}</p>
                              <p className="text-[10px] text-slate-400 font-medium">ID:{course.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-semibold text-gray-500">
                            {course.course_instructor}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-semibold text-gray-800">{course.enrolled_count || 0}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-[11px] font-semibold text-green-600">Active</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleDelete(course.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                              <HiOutlineTrash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <LandingFooter/>
      </main>
    </div>
  );
};

export default AdminDashboard;