import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi } from "../../config/Api";
import { Product } from "../../types/ProductType";

export const fetchProductById = createAsyncThunk<Product, Number>(
  "/products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await publicApi.get(`/products/${productId}`);
      const data = response.data;
      console.log("data---", data);
      return data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchProduct = createAsyncThunk(
  "/products/searchProduct",
  async (query, { rejectWithValue }) => {
    try {
      const response = await publicApi.get(`/products/search`, {
        params: { query },
      });
      const data = response.data;
      console.log("search product data---", data);
      return data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSameProduct = createAsyncThunk<Product[], any>(
  "/products/fetchSameProduct",
  async ({ query, id }, { rejectWithValue }) => {
    console.log("query-----------", query, id);

    try {
      const response = await publicApi.get(
        `/products/get-same-products/${id}`,
        {
          params: { query },
        }
      );
      const data = response.data;
      console.log("same product data---", data);
      return data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllProducts = createAsyncThunk<any, any>(
  "/products/fetchAllProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await publicApi.get(`/products`, {
        params: {
          ...params,
          pageNumber: params.pageNumber || 0,
          status: "APPROVED",
        },
      });
      const data = response.data;
      console.log("all product data---", data);
      return data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTop10ProductDiscount = createAsyncThunk<any, void>(
  "/products/fetchTop10ProductDiscount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await publicApi.get(`/products/top-10-discount`);
      const data = response.data;
      console.log("top-10-discount---", data);
      return data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchTop10Sold = createAsyncThunk<any, void>(
  "/products/fetchTop10Sold",
  async (_, { rejectWithValue }) => {
    try {
      const response = await publicApi.get(`/products/top-10-sold`);
      const data = response.data;
      console.log("top-10-sold---", data);
      return data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(error.response.data);
    }
  }
);

interface ProductState {
  product: Product | null;
  products: Product[];
  loading: boolean;
  error: any;
  totalPages: number;
  searchProducts: Product[];
  topDiscount: Product[];
  topSold: Product[];
}

const initialState: ProductState = {
  product: null,
  products: [],
  loading: false,
  error: null,
  totalPages: 1,
  searchProducts: [],
  topDiscount: [],
  topSold: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchSameProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.searchProducts = action.payload;
      })
      .addCase(searchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTop10ProductDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.topDiscount = action.payload;
      })
      .addCase(fetchTop10Sold.fulfilled, (state, action) => {
        state.loading = false;
        state.topSold = action.payload;
      });
  },
});
export default productSlice.reducer;
