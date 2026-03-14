import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Deal } from "../../types/DealType";

export const fetchDeals = createAsyncThunk<Deal[]>(
  "deals/fetchDeals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/deals");
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(error.response.data.message || "Failed to fetch deals");
    }
  }
);
