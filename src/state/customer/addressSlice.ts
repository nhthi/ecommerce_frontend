import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HomeCategory, HomeData } from "../../types/HomeCategoryType";
import { api, publicApi } from "../../config/Api";
import { Address } from "../../types/UserType";

export const createAddress = createAsyncThunk<Address, Address>(
  "address/createAddress",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/address", data);
      console.log("create address ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(error.response.data.message || "Faild to delete address");
    }
  }
);

export const deleteAddress = createAsyncThunk<void, Number>(
  "address/deleteAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/address/${addressId}`);
      console.log("delete address ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(error.response.data.message || "Faild to create address");
    }
  }
);

export const setDefaultAddress = createAsyncThunk<Address, Number>(
  "address/setDefaultAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/address/set_default/${addressId}`);
      console.log("set default address ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(
        error.response.data.message || "Faild to set default address"
      );
    }
  }
);

interface AddressState {
  address: Address | null;
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  address: null,
  addresses: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
        state.addresses = [action.payload, ...state.addresses];
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failded to create address";
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;

        // Cập nhật danh sách địa chỉ
        state.addresses = state.addresses.map((addr) =>
          addr.id === action.payload.id
            ? { ...addr, default: true }
            : { ...addr, default: false }
        );
      });
  },
});

export default addressSlice.reducer;
