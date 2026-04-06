import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category, CategoryState } from "../../types/CategoryType";
import { api, publicApi } from "../../config/Api";
import { CategoryFormValues } from "../../admin/pages/Category/AddNewCategory";

export const createCategory = createAsyncThunk<Category, CategoryFormValues>(
  "category/createCategory",
  async (request, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/category/admin", request);
      console.log("create category: ", response.data);

      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(error.response.data.message || "Failed to fetch deals");
    }
  },
);

export const updateCategory = createAsyncThunk<
  Category,
  { request: CategoryFormValues; id: Number }
>("category/updateCategory", async ({ request, id }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/category/admin/${id}`, request);
    console.log("update category: ", response.data);

    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    rejectWithValue(error.response.data.message || "Failed to update category");
  }
});

export const fetchAllCategory = createAsyncThunk<Category[], void>(
  "category/fetchAllCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await publicApi.get("/api/category");
      console.log("fetch all category: ", response.data);

      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(error.response.data.message || "Failed to fetch deals");
    }
  },
);

export const deleteCategory = createAsyncThunk<number, number>(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/category/admin/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Xóa danh mục thất bại",
      );
    }
  },
);

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Tìm index của category cần cập nhật trong mảng hiện tại
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id,
        );

        if (index !== -1) {
          // Cập nhật category tại vị trí đó
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload,
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});
export default categorySlice.reducer;
