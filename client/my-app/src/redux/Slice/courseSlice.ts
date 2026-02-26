import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Course {
  id: string;
  course_title: string;
  course_instructor: string;
  course_description: string;
  course_duration: string;
  course_modules: string;
  course_price: string;
  enrolled_count?: string;
  status?: number;
  is_enrolled?: number;
}

export interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
  isAuthenticated: true,
};


export const getCoursesThunk = createAsyncThunk(
  'courses/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        localStorage.clear();
        return rejectWithValue("No token found");
      }

      const response = await axios.get('https://d67jtv7w-5000.inc1.devtunnels.ms/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data;

    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.clear();
        return rejectWithValue("Token expired or invalid");
      }
      return rejectWithValue(error.response?.data?.message || "Error fetching courses");
    }
  }
);


export const deleteCourseThunk = createAsyncThunk(
  'courses/delete',
  async (id: string, { rejectWithValue }) => {
    try {

      const token = localStorage.getItem("token");
      await axios.patch(`https://d67jtv7w-5000.inc1.devtunnels.ms/deactivate-course/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return id;

    } catch (error: any) {
      if (error.response?.status === 401 ) {
        localStorage.clear();
        return rejectWithValue("Token expired or invalid");
      }
      return rejectWithValue(error.response?.data?.message || "Error deleting course");
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    logout: (state) => {
      state.courses = [];
      state.error = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCoursesThunk.pending, (state) => {
        state.loading = state.courses.length === 0; 
      })
      .addCase(getCoursesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCoursesThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })

      
      .addCase(deleteCourseThunk.fulfilled, (state, action) => {
        state.courses = state.courses.filter(course => course.id !== action.payload);
      })
      .addCase(deleteCourseThunk.rejected, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = courseSlice.actions;
export default courseSlice.reducer;