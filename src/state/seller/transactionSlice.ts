import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Order } from "../../types/OrderType";
import { Seller } from "../../types/SellerType";
import { User } from "../../types/UserType";
import { sellerApi } from "../../config/Api";

export interface Transaction {
  id: number;
  customer: User;
  order: Order;
  seller: Seller;
  date: string;
}

interface TransactionState {
  transactions: Transaction[];
  transaction: Transaction | null;
  error: string | null;
  loading: boolean;
}

const initialState: TransactionState = {
  transactions: [],
  transaction: null,
  error: null,
  loading: false,
};

export const fetchTransactionsBySeller = createAsyncThunk<Transaction[], void>(
  "/transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await sellerApi.get("/api/transactions/seller");
      console.log("transactions ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(
        error.response.data.message || "Faild to fetch transactions"
      );
    }
  }
);

export const fetchAllTransactions = createAsyncThunk<
  Transaction[],
  { rejectWithValue: string }
>("/transactions/fetchAllTransactions", async (_, { rejectWithValue }) => {
  try {
    const response = await sellerApi.get("/api/transactions");
    console.log("all transactions ", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    rejectWithValue(
      error.response.data.message || "Faild to fetch transactions"
    );
  }
});

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsBySeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsBySeller.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactionsBySeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default transactionSlice.reducer;
