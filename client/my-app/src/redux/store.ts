import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './Slice/courseSlice';

export const store = configureStore({
  reducer: {
    courseData: courseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
