import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi } from "../../config/Api";
import {
  BlogCategory,
  BlogCategoryFormValues,
  BlogCategoryState,
} from "../../types/BlogType";

export const fetchAllBlogCategories = createAsyncThunk<
  BlogCategory[],
  void,
  { rejectValue: string }
>("blogCategory/fetchAllBlogCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await publicApi.get("/api/blog-categories");
    console.log("fetch all blog categories:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch blog categories"
    );
  }
});

export const fetchBlogCategoryById = createAsyncThunk<
  BlogCategory,
  number,
  { rejectValue: string }
>("blogCategory/fetchBlogCategoryById", async (id, { rejectWithValue }) => {
  try {
    const response = await publicApi.get(`/api/blog-categories/${id}`);
    console.log("fetch blog category by id:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch blog category"
    );
  }
});

export const createBlogCategory = createAsyncThunk<
  BlogCategory,
  BlogCategoryFormValues,
  { rejectValue: string }
>("blogCategory/createBlogCategory", async (request, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/blog-categories", request);
    console.log("create blog category:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to create blog category"
    );
  }
});

export const updateBlogCategory = createAsyncThunk<
  BlogCategory,
  { id: number; request: BlogCategoryFormValues },
  { rejectValue: string }
>(
  "blogCategory/updateBlogCategory",
  async ({ id, request }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/blog-categories/${id}`, request);
      console.log("update blog category:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update blog category"
      );
    }
  }
);

export const deleteBlogCategory = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("blogCategory/deleteBlogCategory", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/blog-categories/${id}`);
    console.log("delete blog category:", id);
    return id;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to delete blog category"
    );
  }
});

const initialState: BlogCategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const adminBlogCategorySlice = createSlice({
  name: "blogCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllBlogCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch blog categories";
      })

      .addCase(fetchBlogCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        } else {
          state.categories.push(action.payload);
        }
      })
      .addCase(fetchBlogCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch blog category";
      })

      .addCase(createBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create blog category";
      })

      .addCase(updateBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update blog category";
      })

      .addCase(deleteBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete blog category";
      });
  },
});

export default adminBlogCategorySlice.reducer;