import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi } from "../../config/Api";
import {
  BlogPost,
  BlogPostFormValues,
  BlogPostState,
} from "../../types/BlogType";

export const fetchAllBlogPosts = createAsyncThunk<
  BlogPost[],
  void,
  { rejectValue: string }
>("blogPost/fetchAllBlogPosts", async (_, { rejectWithValue }) => {
  try {
    const response = await publicApi.get("/api/blog-posts");
    console.log("fetch all blog posts:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch blog posts"
    );
  }
});

export const fetchBlogPostById = createAsyncThunk<
  BlogPost,
  number,
  { rejectValue: string }
>("blogPost/fetchBlogPostById", async (id, { rejectWithValue }) => {
  try {
    const response = await publicApi.get(`/api/blog-posts/${id}`);
    console.log("fetch blog post by id:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch blog post"
    );
  }
});

export const createBlogPost = createAsyncThunk<
  BlogPost,
  BlogPostFormValues,
  { rejectValue: string }
>("blogPost/createBlogPost", async (request, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/blog-posts", request);
    console.log("create blog post:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to create blog post"
    );
  }
});

export const updateBlogPost = createAsyncThunk<
  BlogPost,
  { id: number; request: BlogPostFormValues },
  { rejectValue: string }
>("blogPost/updateBlogPost", async ({ id, request }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/blog-posts/${id}`, request);
    console.log("update blog post:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to update blog post"
    );
  }
});

export const deleteBlogPost = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("blogPost/deleteBlogPost", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/blog-posts/${id}`);
    console.log("delete blog post:", id);
    return id;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to delete blog post"
    );
  }
});

export const replaceBlogPostTags = createAsyncThunk<
  BlogPost,
  { id: number; tagIds: number[] },
  { rejectValue: string }
>("blogPost/replaceBlogPostTags", async ({ id, tagIds }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/blog-posts/${id}/tags`, tagIds);
    console.log("replace blog post tags:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to replace blog post tags"
    );
  }
});

export const increaseBlogPostView = createAsyncThunk<
  BlogPost,
  number,
  { rejectValue: string }
>("blogPost/increaseBlogPostView", async (id, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/blog-posts/${id}/view`);
    console.log("increase blog post view:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to increase blog post view"
    );
  }
});

const initialState: BlogPostState = {
  posts: [],
  loading: false,
  error: null,
};

const adminBlogPostSlice = createSlice({
  name: "blogPost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchAllBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch blog posts";
      })

      .addCase(fetchBlogPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPostById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        } else {
          state.posts.push(action.payload);
        }
      })
      .addCase(fetchBlogPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch blog post";
      })

      .addCase(createBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create blog post";
      })

      .addCase(updateBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updateBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update blog post";
      })

      .addCase(deleteBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete blog post";
      })

      .addCase(replaceBlogPostTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(replaceBlogPostTags.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(replaceBlogPostTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to replace blog post tags";
      })

      .addCase(increaseBlogPostView.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      });
  },
});

export default adminBlogPostSlice.reducer;