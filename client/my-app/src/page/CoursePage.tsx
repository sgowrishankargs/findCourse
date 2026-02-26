import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { getCoursesThunk } from '../redux/Slice/courseSlice';
import { HiStar, HiOutlineClock, HiOutlineBookOpen, HiSearch } from 'react-icons/hi';
import { FiLogOut } from 'react-icons/fi';
import { LiaRupeeSignSolid } from "react-icons/lia";
import LandingFooter from '../components/LandingFooter';
import CourseFilter from '../components/CourseFilter';

const CoursePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { courses, loading, isAuthenticated } = useSelector((state: RootState) => state.courseData);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<any>({
    categories: []
  });

  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.clear();
      navigate("/");
    } else {
      // Add a small delay to ensure token is fully set in localStorage
      const timer = setTimeout(() => {
        dispatch(getCoursesThunk());
      }, 100);
      
      window.addEventListener('focus', () => dispatch(getCoursesThunk()));
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('focus', () => dispatch(getCoursesThunk()));
      };
    }
  }, [navigate, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.clear();
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      let result = [...courses];
      
      if (searchTerm.trim() !== "") {
        result = result.filter(course =>
          course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (activeFilters.categories.length > 0) {
        result = result.filter(course =>
          activeFilters.categories.some((cat: string) =>
            course.course_title.toLowerCase().includes(cat.toLowerCase())
          )
        );
      }

      setFilteredCourses(result);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, activeFilters, courses]);

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/login");
  };

  const toggleDescription = (id: number) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleFindCourse =() => {
    localStorage.clear(); 
    navigate("/");
  };

  const handleEnroll = async (courseId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        'https://d67jtv7w-5000.inc1.devtunnels.ms/enroll',
        { course_id: courseId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 201) {
        // alert("Success: You have enrolled in the course!");
        dispatch(getCoursesThunk());
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Enrollment failed";
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-700">

      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between">

        <div className="flex justify-start items-center gap-10 flex-1">

          <button onClick={handleFindCourse}
           className="text-2xl font-bold text-blue-500 tracking-tighter cursor-pointer">
            findCourse
          </button>

          <div className="flex ml-36 items-center relative max-w-md w-full hidden md:block">

            <HiSearch className="absolute left-3 top-1/4 -translate-y-1/2 text-gray-500" size={20} />

            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full bg-slate-100 border rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>

        </div>

        <div className="flex items-center gap-4">

          <div className="rounded-full border border-white flex items-center justify-center font-semibold text-blue-600">
            {localStorage.getItem("userName")?.toUpperCase()}
          </div>

          <button onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition text-2xl"><FiLogOut />
          </button>

        </div>

      </header>

      {/* <section className='flex w-full '> */}

      <section className="flex flex-col lg:flex-row w-full   ">

        {/* <div className='shadow-mx p-5 m-5 sticky top-24 h-fit self-start'> */}

         <div className="w-full lg:w-1/5   lg:p-6  bg-white border border-slate-200 rounded-2xl lg:sticky lg:top-24 h-fit self-start shadow-sm   ">
          <CourseFilter onFilterChange={handleFilterChange} />
        </div>

        {/* <div className="flex-1 mt-3 p-5 pr-10"> */}

         <div className="w-full  lg:p-5 lg:pr-7 ">

          <h2 className="text-2xl font-semibold text-slate-800 mb-8">Featured Courses</h2>

         {filteredCourses.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium">
              No courses found matching these filters.
            </div>

          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
               
                <div key={course.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col">

                  <div className="relative">
                    <img
                      src="https://allwebnmobile.com/wp-content/uploads/2018/07/webdesign1.jpg"
                      alt="course"
                      className="w-full h-44 object-cover"
                    />
                    
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-blue-600 ">
                          {course.course_title}
                        </h3>

                        <div className="flex items-center gap-1 text-amber-500 text-sm font-semibold">
                          <HiStar  size={16} />
                          <span>4.8</span>
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-gray-600 mt-1 mb-3">
                        BY {course.course_instructor}
                      </p>

                      <div className="relative">
                        <p 
                          className="text-sm text-slate-600 leading-relaxed transition-all duration-300"
                          style={!expandedIds[course.id] ? {
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          } : {
                            display: 'block'
                          }}
                        >
                          {course.course_description}
                        </p>

                        <button 
                          onClick={() => toggleDescription(course.id)}
                          className="text-blue-600 font-medium text-xs mt-2 hover:underline block"
                        >
                          {expandedIds[course.id] ? 'See Less' : 'See More'}
                        </button>
                      </div>
                    </div>

                    <div className=" flex  flex-col gap-2 mt-5 border-t pt-4">

                      <div className="flex justify-between text-md text-slate-500 mb-3">
                        <div className="flex items-center gap-2">
                          <HiOutlineClock size={18} />
                          {course.course_duration}
                        </div>

                        <div className="flex items-center gap-2">
                          <HiOutlineBookOpen size={20} />
                          {course.course_modules}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">

                        <div className="flex items-center text-lg font-semibold text-gray-700">
                          <LiaRupeeSignSolid />
                          {course.course_price}
                        </div>

                        <button
                          onClick={() => handleEnroll(course.id)}
                          disabled={course.is_enrolled === 1}
                          className={`px-4 py-1.5 text-sm rounded-lg transition shadow ${
                            course.is_enrolled === 1
                              ? 'bg-blue-400 text-white cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {course.is_enrolled === 1 ? 'Enrolled' : 'Enroll Now'}
                        </button>

                      </div>
                    </div>

                  </div>
                </div>

              ))}
            </div>
          )}
        </div>
      </section>

      <footer>
        <LandingFooter/>
      </footer>
    </div>
  );
};

export default CoursePage;