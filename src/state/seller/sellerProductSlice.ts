import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi, sellerApi } from "../../config/Api";
import { Product } from "../../types/ProductType";

export const fetchProductBySellerId = createAsyncThunk<Product[], number>(
  "/sellerProduct/fetchProductBySellerId",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await publicApi.get(`/products/seller/${productId}`);
      const data = response.data;
      console.log("data---", data);

      return data;
    } catch (error: any) {
      console.error("fetch product error:", error);
      // Lấy message từ server nếu có
      const errorMsg =
        error.response?.data?.message || "Failed to fetch product";
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSellerProducts = createAsyncThunk<Product[]>(
  "/sellerProduct/fetchSellerProducts",
  async () => {
    try {
      const response = await sellerApi.get("/sellers/product");
      const data = response.data;
      console.log("data---", data);

      return data;
    } catch (error) {
      console.log("error----", error);
    }
  }
);

export const createProduct = createAsyncThunk<Product, any>(
  "sellerProduct/createProduct",
  async ({ request }, { rejectWithValue }) => {
    try {
      const response = await sellerApi.post("/sellers/product", request);
      console.log("create product data ---", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Create product error:", error);

      // Lấy message từ server nếu có
      const errorMsg =
        error.response?.data?.message || "Failed to create product";
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateProduct = createAsyncThunk<Product, any>(
  "sellerProduct/updateProduct",
  async ({ id, request }, { rejectWithValue }) => {
    try {
      const response = await sellerApi.put(`/sellers/product/${id}`, request);
      console.log("update product data ---", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Update product error:", error);

      // Lấy message từ server nếu có
      const errorMsg =
        error.response?.data?.message || "Failed to update product";
      return rejectWithValue(errorMsg);
    }
  }
);

interface SellerProductState {
  products: Product[];
  loading: boolean;
  error: any;
}

const initialState: SellerProductState = {
  products: [],
  loading: false,
  error: null,
};

const sellerProductSlice = createSlice({
  name: "sellerProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductBySellerId.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.products.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.products[idx] = action.payload; // update đúng
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sellerProductSlice.reducer;
