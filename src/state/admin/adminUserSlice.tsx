import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category, CategoryState } from "../../types/CategoryType";
import { api } from "../../config/Api";
import { CategoryFormValues } from "../../admin/pages/Category/AddNewCategory";
import { User } from "../../types/UserType";
import { Seller } from "../../types/SellerType";

export const fetchAllCustomer = createAsyncThunk<User[], void>(
  "adminUser/fetchAllCustomer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/users?role=ROLE_CUSTOMER");
      console.log("fetch all users: ", response.data);

      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(
        error.response.data.message || "Failed to fetch all users"
      );
    }
  }
);

export const fetchAllSellers = createAsyncThunk<Seller[], string>(
  "adminUser/fetchAllSeller",
  async (status, { rejectWithValue }) => {
    try {
      console.log(status);

      let response;
      if (status === "all") {
        response = await api.get(`/sellers`);
      } else response = await api.get(`/sellers?status=${status}`);
      console.log("fetch all sellers: ", response.data);

      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(
        error.response.data.message || "Failed to fetch all users"
      );
    }
  }
);
export const updateUserStatus = createAsyncThunk<
  User,
  { id: number; status: string }
>("adminUser/updateUserStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/api/admin/user/${id}/status/${status}`);
    return res.data;
  } catch (err: any) {
    console.log(err);

    return rejectWithValue(
      err.response?.data?.message || "Failed to update user status"
    );
  }
});

export const updateSellerStatus = createAsyncThunk<
  Seller,
  { id: number; status: string }
>(
  "adminUser/updateSellerStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/admin/seller/${id}/status/${status}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update seller status"
      );
    }
  }
);
interface AdminUserState {
  customers: User[];
  seller: Seller[];
  loading: boolean;
  error: string | null;
}
const initialState: AdminUserState = {
  customers: [],
  seller: [],
  loading: false,
  error: null,
};

const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchAllCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload;
        state.error = null;
      })
      .addCase(fetchAllSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }) // ===== UPDATE SELLER STATUS =====
      .addCase(updateSellerStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        state.seller = state.seller.map((s) =>
          s.id === updated.id ? updated : s
        );
      })
      .addCase(updateSellerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default adminUserSlice.reducer;
