import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

// Get Cars
export const getMyCars = createAsyncThunk(
  "car/getMyCars",
  async () => {
    const res = await api.post("/car/get-all-car");
    return res.data.cars;
  }
);

// Add Car
export const addCar = createAsyncThunk(
  "car/addCar",
  async (carData, thunkAPI) => {
    try {
      const res = await api.post("/car/add-car", carData);
      return res.data.car;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const carSlice = createSlice({
  name: "car",

  initialState: {
    cars: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Get Cars
      .addCase(getMyCars.pending, (state) => {
        state.loading = true;
      })

      .addCase(getMyCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload;
      })

      .addCase(getMyCars.rejected, (state) => {
        state.loading = false;
      })

      // Add Car
      .addCase(addCar.pending, (state) => {
        state.loading = true;
      })

      .addCase(addCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars.unshift(action.payload);
      })

      .addCase(addCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default carSlice.reducer;