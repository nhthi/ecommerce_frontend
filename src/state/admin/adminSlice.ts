import { Home } from "@mui/icons-material";
import { create } from "domain";
import { HomeCategory, HomeData } from "../../types/HomeCategoryType";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi } from "../../config/Api";

export const updateHomeCategory = createAsyncThunk<
  HomeCategory,
  {
    id: number;
    data: HomeCategory;
  }
>("homeCategory/updateCategory", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/admin/home-category/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    rejectWithValue(
      error.response.data.message || "Faild to update home category"
    );
  }
});

export const fetchHomeCategories = createAsyncThunk<HomeCategory[]>(
  "homeCategory/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await publicApi.get("/admin/home-category");
      console.log("fetch home categories: ", response.data);

      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(
        error.response.data.message || "Faild to fetch home categories"
      );
    }
  }
);

interface HomeCategoryState {
  categories: HomeCategory[];
  loading: boolean;
  error: string | null;
  categoryUpdated: boolean;
}

const initialState: HomeCategoryState = {
  categories: [],
  loading: false,
  error: null,
  categoryUpdated: false,
};

const homeCategorySlice = createSlice({
  name: "homeCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.categoryUpdated = false;
      })
      .addCase(updateHomeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryUpdated = false;
        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        } else {
          state.categories.push(action.payload);
        }
      })
      .addCase(updateHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.categoryUpdated = false;
      })
      .addCase(fetchHomeCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
        state.categoryUpdated = false;
      })
      .addCase(fetchHomeCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.categoryUpdated = false;
      });
  },
});
export default homeCategorySlice.reducer;
