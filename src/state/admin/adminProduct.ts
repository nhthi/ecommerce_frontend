import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Product } from "../../types/ProductType";

export const fetchAllProducts = createAsyncThunk<any>(
  "/admin/fetchAllProducts",
  async () => {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error) {
      console.log("error----", error);
    }
  },
);

export const fetchAdminProductById = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>("adminproduct/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || "Failed to fetch product";
    return rejectWithValue(errorMsg);
  }
});

export const createAdminProduct = createAsyncThunk<
  Product,
  any,
  { rejectValue: string }
>("adminproduct/createProduct", async (request, { rejectWithValue }) => {
  try {
    const response = await api.post("/admin/product", request);
    return response.data;
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || "Failed to create product";
    return rejectWithValue(errorMsg);
  }
});

export const updateAdminProduct = createAsyncThunk<
  Product,
  { id: number; request: any },
  { rejectValue: string }
>("adminproduct/updateProduct", async ({ id, request }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/admin/product/${id}`, request);
    return response.data;
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message || "Failed to update product";
    return rejectWithValue(errorMsg);
  }
});

export const deleteProduct = createAsyncThunk<
  any,
  number,
  { rejectValue: string }
>("sellerProduct/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/admin/product/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Delete product error:", error);

    const errorMsg =
      error.response?.data?.message || "Failed to delete product";
    return rejectWithValue(errorMsg);
  }
});

export const updateProductStatus = createAsyncThunk<
  Product,
  { id: number; status: string }
>(
  "adminproduct/updateProductStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/admin/product/${id}/status/${status}`,
      );
      return response.data;
    } catch (error: any) {
      console.log("update error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product status",
      );
    }
  },
);

interface AdminProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: any;
}

const initialState: AdminProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

const adminProductSlice = createSlice({
  name: "adminproduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.content || [];
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchAdminProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdminProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAdminProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.products = state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        );
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.products = state.products.map((p) =>
          p.id === updated.id ? updated : p,
        );
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.products = state.products.filter((p) => p.id !== deletedId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminProductSlice.reducer;
