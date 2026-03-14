import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi } from "../config/Api";
import { User } from "../types/UserType";

export const sendLoginSignupOtp = createAsyncThunk(
  "/auth/sendLoginSignupOtp",
  async (
    { email, role }: { email: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await publicApi.post("/auth/sent/login-signup-otp", {
        email,
        role,
      });
      console.log("login otp ", response);
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP."
      );
    }
  }
);

export const updateProfileUser = createAsyncThunk<any, any>(
  "/auth/updateProfile",
  async (updateUser, { rejectWithValue }) => {
    try {
      const response = await api.put("/users/profile", updateUser);
      console.log("update user ", response);
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user."
      );
    }
  }
);

export const signin = createAsyncThunk<any, any>(
  "/auth/login",
  async (loginRequest, { rejectWithValue }) => {
    try {
      const response = await publicApi.post("/auth/login", loginRequest);
      console.log("login otp ", response.data);
      localStorage.clear();
      const jwt = response.data.jwt;
      localStorage.setItem("jwt", jwt);
      return jwt;
    } catch (error: any) {
      console.log("error----", error);
      rejectWithValue(error.response?.data?.message || "Failed to sigin.");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "/auth/fetchUserProfile",
  async () => {
    try {
      const response = await api.post("/users/profile");
      console.log("user profile ", response.data);
      return response.data;
    } catch (error) {
      console.log("error----", error);
    }
  }
);

export const signup = createAsyncThunk<any, any>(
  "auth/signup", // ⚠️ Không nên bắt đầu bằng "/"
  async (signupRequest, { rejectWithValue }) => {
    try {
      const response = await publicApi.post("/auth/signup", signupRequest);
      console.log("signup response:", response.data);

      const jwt = response.data.jwt;
      localStorage.setItem("jwt", jwt);
      return jwt;
    } catch (error: any) {
      console.log("Signup error:", error);

      // ✅ Bắt lỗi chi tiết từ backend
      if (error.response && error.response.data) {
        const message =
          error.response.data.message ||
          error.response.data.error ||
          "Signup failed. Please try again.";
        return rejectWithValue(message);
      }

      return rejectWithValue("Network error. Please try again later.");
    }
  }
);

export const logout = createAsyncThunk<any, any>(
  "/auth/logout",
  async (navigate, { rejectWithValue }) => {
    try {
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.log("error----", error);
      return rejectWithValue(error);
    }
  }
);

interface AuthState {
  jwt: string | null;
  otpSent: boolean;
  user: any;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  jwt: null,
  isLoggedIn: false,
  otpSent: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload;
        state.isLoggedIn = true;
        state.error = null;
        // state.user = action.payload.user;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to login";
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload;
        state.isLoggedIn = true;
        state.error = null;
        // state.user = action.payload.user;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to signup";
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.isLoggedIn = true;
      })
      .addCase(updateProfileUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.isLoggedIn = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user profile";
      })
      .addCase(sendLoginSignupOtp.fulfilled, (state) => {
        state.otpSent = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.jwt = null;
        state.isLoggedIn = false;
      });
  },
});
export default authSlice.reducer;
