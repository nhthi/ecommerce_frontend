import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HomeCategory, HomeData } from "../../types/HomeCategoryType";
import { api, publicApi } from "../../config/Api";

export const createHomeCategories = createAsyncThunk<HomeData, HomeCategory[]>(
  "homeCategory/createCategories",
  async (data, { rejectWithValue }) => {
    try {
      const response = await publicApi.post("/admin/home/categories", data);
      console.log("create home categories ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(
        error.response.data.message || "Faild to create home categories"
      );
    }
  }
);

interface HomeState {
  homePageData: HomeData | null;
  homeCategories: HomeCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  homePageData: null,
  homeCategories: [],
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createHomeCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHomeCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.homePageData = action.payload;
      })
      .addCase(createHomeCategories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failded to create home categories";
      });
  },
});

export default homeSlice.reducer;
