import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi } from "../../config/Api";
import { Product } from "../../types/ProductType";

interface ProductListResponse {
  content: Product[];
  totalPages: number;
}

interface SmartSearchParams {
  query: string;
  maxPrice?: number;
  limit?: number;
  pageNumber?: number;
}

interface FetchAllProductsParams {
  pageNumber?: number;
  [key: string]: any;
}

export const fetchProductById = createAsyncThunk<Product, number>(
  "/products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error: any) {
      console.log("fetchProductById error ----", error);
      return rejectWithValue(
        error?.response?.data || "Không thể tải chi tiết sản phẩm"
      );
    }
  }
);

export const searchProduct = createAsyncThunk<Product[], string>(
  "/products/searchProduct",
  async (query, { rejectWithValue }) => {
    try {
      const response = await publicApi.get(`/products/search`, {
        params: { query },
      });
      return response.data;
    } catch (error: any) {
      console.log("searchProduct error ----", error);
      return rejectWithValue(
        error?.response?.data || "Không thể tìm kiếm sản phẩm"
      );
    }
  }
);

export const fetchSameProduct = createAsyncThunk<
  Product[],
  { query: string; id: number | string }
>("/products/fetchSameProduct", async ({ query, id }, { rejectWithValue }) => {
  try {
    const response = await publicApi.get(`/products/get-same-products/${id}`, {
      params: { query },
    });
    return response.data;
  } catch (error: any) {
    console.log("fetchSameProduct error ----", error);
    return rejectWithValue(
      error?.response?.data || "Không thể tải sản phẩm tương tự"
    );
  }
});

export const fetchAllProducts = createAsyncThunk<
  ProductListResponse,
  FetchAllProductsParams
>("/products/fetchAllProducts", async (params, { rejectWithValue }) => {
  try {
    const response = await publicApi.get(`/products`, {
      params: {
        ...params,
        pageNumber: params?.pageNumber ?? 0,
        status: "APPROVED",
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("fetchAllProducts error ----", error);
    return rejectWithValue(
      error?.response?.data || "Không thể tải danh sách sản phẩm"
    );
  }
});

export const smartSearchProduct = createAsyncThunk<Product[], SmartSearchParams>(
  "/products/smartSearchProduct",
  async (params, { rejectWithValue }) => {
    try {
      const response = await publicApi.get(`/api/smart-search`, {
        params: {
          query: params.query,
          maxPrice: params.maxPrice,
          limit: params.limit ?? 10,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("smartSearchProduct error ----", error);
      return rejectWithValue(
        error?.response?.data || "Không thể tìm kiếm thông minh"
      );
    }
  }
);

export const fetchTop10ProductDiscount = createAsyncThunk<Product[], void>(
  "/products/fetchTop10ProductDiscount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await publicApi.get(`/products/top-10-discount`);
      return response.data;
    } catch (error: any) {
      console.log("fetchTop10ProductDiscount error ----", error);
      return rejectWithValue(
        error?.response?.data || "Không thể tải top giảm giá"
      );
    }
  }
);

export const fetchTop10Sold = createAsyncThunk<Product[], void>(
  "/products/fetchTop10Sold",
  async (_, { rejectWithValue }) => {
    try {
      const response = await publicApi.get(`/products/top-10-sold`);
      return response.data;
    } catch (error: any) {
      console.log("fetchTop10Sold error ----", error);
      return rejectWithValue(
        error?.response?.data || "Không thể tải top bán chạy"
      );
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
      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchSameProduct
      .addCase(fetchSameProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSameProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchSameProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // searchProduct
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

      // fetchAllProducts
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content ?? [];
        state.totalPages = action.payload.totalPages ?? 1;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // smartSearchProduct
      .addCase(smartSearchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(smartSearchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload ?? [];
        state.totalPages = 1;
      })
      .addCase(smartSearchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchTop10ProductDiscount
      .addCase(fetchTop10ProductDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTop10ProductDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.topDiscount = action.payload;
      })
      .addCase(fetchTop10ProductDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchTop10Sold
      .addCase(fetchTop10Sold.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTop10Sold.fulfilled, (state, action) => {
        state.loading = false;
        state.topSold = action.payload;
      })
      .addCase(fetchTop10Sold.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;