import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../config/Api";
import { Address } from "../../types/UserType";

export const createAddress = createAsyncThunk<
  Address,
  Address,
  { rejectValue: string }
>("address/createAddress", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/address", data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create address"
    );
  }
});

export const deleteAddress = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("address/deleteAddress", async (addressId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/address/${addressId}`);
    return addressId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete address"
    );
  }
});

export const setDefaultAddress = createAsyncThunk<
  Address,
  number,
  { rejectValue: string }
>("address/setDefaultAddress", async (addressId, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/address/set_default/${addressId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to set default address"
    );
  }
});

interface AddressState {
  address: Address | null;
  addresses: Address[];
  selectedAddress: Address | null;
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  address: null,
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setSelectedAddress: (state, action: PayloadAction<Address>) => {
      state.selectedAddress = action.payload;
    },
    setSelectedAddressById: (state, action: PayloadAction<number>) => {
      const found = state.addresses.find((addr) => addr.id === action.payload);
      if (found) {
        state.selectedAddress = found;
      }
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    },
  },
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
        state.selectedAddress = action.payload;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create address";
      })

      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;

        state.addresses = state.addresses.map((addr) => ({
          ...addr,
          default: addr.id === action.payload.id,
        }));

        const updatedSelected =
          state.addresses.find((addr) => addr.id === action.payload.id) || {
            ...action.payload,
            default: true,
          };

        state.selectedAddress = updatedSelected;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to set default address";
      })

      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;

        state.addresses = state.addresses.filter(
          (addr) => addr.id !== action.payload
        );

        if (state.selectedAddress?.id === action.payload) {
          state.selectedAddress =
            state.addresses.find((addr) => addr.default) ||
            state.addresses[0] ||
            null;
        }

        if (state.address?.id === action.payload) {
          state.address = null;
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete address";
      });
  },
});

export const {
  setSelectedAddress,
  setSelectedAddressById,
  clearSelectedAddress,
} = addressSlice.actions;

export default addressSlice.reducer;