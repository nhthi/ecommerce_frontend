import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi } from "../../config/Api";
import { User } from "../../types/UserType";
import { Seller } from "../../types/SellerType";

export const fetchAllCustomer = createAsyncThunk<User[], void>(
  "adminUser/fetchAllCustomer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/users?role=ROLE_CUSTOMER");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all users",
      );
    }
  },
);

export const fetchAllStaff = createAsyncThunk<User[], void>(
  "adminUser/fetchAllStaff",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/users?role=ROLE_STAFF");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all staff",
      );
    }
  },
);

export const sendStaffAccountOtp = createAsyncThunk<
  any,
  { email: string },
  { rejectValue: string }
>("adminUser/sendStaffAccountOtp", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await publicApi.post("/auth/sent/login-signup-otp", {
      email,
      role: "ROLE_STAFF",
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send OTP",
    );
  }
});

export const createStaffAccount = createAsyncThunk<
  User,
  {
    email: string;
    fullName: string;
    password: string;
  },
  { rejectValue: string }
>("adminUser/createStaffAccount", async (request, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/admin/staff", request);
    return response.data?.user || response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create staff account",
    );
  }
});

export const fetchAllSellers = createAsyncThunk<Seller[], string>(
  "adminUser/fetchAllSeller",
  async (status, { rejectWithValue }) => {
    try {
      let response;
      if (status === "all") {
        response = await api.get(`/sellers`);
      } else {
        response = await api.get(`/sellers?status=${status}`);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all sellers",
      );
    }
  },
);

export const updateUserStatus = createAsyncThunk<
  User,
  { id: number; status: string }
>("adminUser/updateUserStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/api/admin/user/${id}/status/${status}`);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update user status",
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
        err.response?.data?.message || "Failed to update seller status",
      );
    }
  },
);

interface AdminUserState {
  customers: User[];
  staffs: User[];
  seller: Seller[];
  loading: boolean;
  error: string | null;
}
const initialState: AdminUserState = {
  customers: [],
  staffs: [],
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
      .addCase(fetchAllCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffs = action.payload;
        state.error = null;
      })
      .addCase(fetchAllStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createStaffAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStaffAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.staffs.unshift(action.payload);
        state.error = null;
      })
      .addCase(createStaffAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllSellers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.seller = action.payload;
        state.error = null;
      })
      .addCase(fetchAllSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.customers = state.customers.map((user) =>
          user.id === updated.id ? updated : user,
        );
        state.staffs = state.staffs.map((user) =>
          user.id === updated.id ? updated : user,
        );
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSellerStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSellerStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.seller = state.seller.map((s) =>
          s.id === updated.id ? updated : s,
        );
      })
      .addCase(updateSellerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default adminUserSlice.reducer;
