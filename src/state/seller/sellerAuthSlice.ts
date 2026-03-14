import { createAsyncThunk } from "@reduxjs/toolkit";
import { api, publicApi } from "../../config/Api";

export const sellerLogin = createAsyncThunk<any, any>(
  "/auth/login",
  async (loginRequest, { rejectWithValue }) => {
    try {
      const response = await publicApi.post("/sellers/login", loginRequest);
      console.log("login otp ", response.data);
      localStorage.clear();
      const jwt = response.data.jwt;
      localStorage.setItem("jwt_seller", jwt);
    } catch (error) {
      console.log("error----", error);
    }
  }
);

export const createSeller = createAsyncThunk<any, any>(
  "/sellers/register",
  async (request, { rejectWithValue }) => {
    try {
      const response = await publicApi.post("/sellers", request);
      console.log("register seller ", response.data);
      return response.data; // ✅ BẮT BUỘC phải return kết quả thành công
    } catch (error: any) {
      console.log("error----", error);

      // ✅ BẮT BUỘC phải reject để onSubmit bắt được lỗi
      return rejectWithValue(
        error.response?.data?.message || "Failed to register seller"
      );
    }
  }
);
