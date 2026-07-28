import { configureStore } from "@reduxjs/toolkit";
import carReducer from "../redux/car/carSlice.js";

export const store = configureStore({
  reducer: {
    car: carReducer,
  },
});