import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Product } from "../../types/ProductType";

export const fetchAllProducts = createAsyncThunk<any>(
  "/admin/fetchAllProducts",
  async () => {
    try {
      const response = await api.get("/products");
      const data = response.data;
      console.log("data---", data);

      return data;
    } catch (error) {
      console.log("error----", error);
    }
  }
);

interface AdminProductState {
  products: Product[];
  loading: boolean;
  error: any;
}

const initialState: AdminProductState = {
  products: [],
  loading: false,
  error: null,
};
export const updateProductStatus = createAsyncThunk<
  Product, // kiểu trả về
  { id: number; status: string } // params truyền vào
>(
  "adminproduct/updateProductStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/admin/product/${id}/status/${status}`
      );
      return response.data; // trả về product đã update
    } catch (error: any) {
      console.log("update error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product status"
      );
    }
  }
);
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
        state.products = action.payload.content;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.loading = false;

        // cập nhật lại product trong list
        const updated = action.payload;
        state.products = state.products.map((p) =>
          p.id === updated.id ? updated : p
        );
      });
  },
});

export default adminProductSlice.reducer;
