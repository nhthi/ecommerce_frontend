import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi, sellerApi } from "../../config/Api";
import { logout } from "../AuthSlice";

export const fetchSellerProfile = createAsyncThunk(
  "/sellers/fetchSellerProfile",
  async () => {
    try {
      const response = await sellerApi.get("/sellers/profile");
      console.log("fetch seller profile ", response.data);
      return response.data;
    } catch (error) {
      console.log("error----", error);
    }
  }
);
export const updateSeller = createAsyncThunk(
  "/sellers/updateSeller",
  async (sellerData: any, { rejectWithValue }) => {
    try {
      const response = await sellerApi.patch("/sellers", sellerData);
      console.log("update seller response:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Update seller failed");
    }
  }
);
export const fetchSellerById = createAsyncThunk<any, Number>(
  "/sellers/fetchSellerById",
  async (sellerId) => {
    try {
      const response = await publicApi.get(`/sellers/${sellerId}`);
      console.log("fetch seller by id ", response.data);
      return response.data;
    } catch (error) {
      console.log("error----", error);
    }
  }
);

interface SellerState {
  sellers: any[];
  selectedSeller: any;
  profile: any;
  report: any;
  loading: boolean;
  error: any;
}
const initialState: SellerState = {
  sellers: [],
  selectedSeller: null,
  profile: null,
  report: null,
  loading: false,
  error: null,
};

const sellerSlice = createSlice({
  name: "sellers",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchSellerById.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload; // cập nhật vào state
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.profile = null;
      });
  },
});

export default sellerSlice.reducer;
