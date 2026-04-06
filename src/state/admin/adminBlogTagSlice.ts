import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi } from "../../config/Api";
import { BlogTag, BlogTagFormValues, BlogTagState } from "../../types/BlogType";

export const fetchAllBlogTags = createAsyncThunk<
  BlogTag[],
  void,
  { rejectValue: string }
>("blogTag/fetchAllBlogTags", async (_, { rejectWithValue }) => {
  try {
    const response = await publicApi.get("/api/blog-tags");
    console.log("fetch all blog tags:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch blog tags"
    );
  }
});

export const fetchBlogTagById = createAsyncThunk<
  BlogTag,
  number,
  { rejectValue: string }
>("blogTag/fetchBlogTagById", async (id, { rejectWithValue }) => {
  try {
    const response = await publicApi.get(`/api/blog-tags/${id}`);
    console.log("fetch blog tag by id:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch blog tag"
    );
  }
});

export const createBlogTag = createAsyncThunk<
  BlogTag,
  BlogTagFormValues,
  { rejectValue: string }
>("blogTag/createBlogTag", async (request, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/blog-tags", request);
    console.log("create blog tag:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to create blog tag"
    );
  }
});

export const updateBlogTag = createAsyncThunk<
  BlogTag,
  { id: number; request: BlogTagFormValues },
  { rejectValue: string }
>("blogTag/updateBlogTag", async ({ id, request }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/blog-tags/${id}`, request);
    console.log("update blog tag:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to update blog tag"
    );
  }
});

export const deleteBlogTag = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("blogTag/deleteBlogTag", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/blog-tags/${id}`);
    console.log("delete blog tag:", id);
    return id;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to delete blog tag"
    );
  }
});

const initialState: BlogTagState = {
  tags: [],
  loading: false,
  error: null,
};

const adminBlogTagSlice = createSlice({
  name: "blogTag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchAllBlogTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch blog tags";
      })

      .addCase(fetchBlogTagById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogTagById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tags.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.tags[index] = action.payload;
        } else {
          state.tags.push(action.payload);
        }
      })
      .addCase(fetchBlogTagById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch blog tag";
      })

      .addCase(createBlogTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags.push(action.payload);
      })
      .addCase(createBlogTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create blog tag";
      })

      .addCase(updateBlogTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogTag.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tags.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
      })
      .addCase(updateBlogTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update blog tag";
      })

      .addCase(deleteBlogTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = state.tags.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteBlogTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete blog tag";
      });
  },
});

export default adminBlogTagSlice.reducer;