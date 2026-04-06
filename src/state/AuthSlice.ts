import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi } from "../config/Api";
import { User } from "../types/UserType";

export const sendLoginSignupOtp = createAsyncThunk(
  "/auth/sendLoginSignupOtp",
  async (
    { email, password, role }: { email: string; password: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await publicApi.post("/auth/sent/login-signup-otp", {
        email,
        password,
        role,
      });
      console.log("login otp ", response);
      return response.data;
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
      console.log("update user ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user."
      );
    }
  }
);

export const changePassword = createAsyncThunk<
  any,
  {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
>(
  "/auth/changePassword",
  async ({ oldPassword, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await api.put("/users/change-password", {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      console.log("change password response:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("change password error----", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password."
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to signin."
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "/auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/profile");
      console.log("user profile ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile."
      );
    }
  }
);

export const signup = createAsyncThunk<any, any>(
  "auth/signup",
  async (signupRequest, { rejectWithValue }) => {
    try {
      const response = await publicApi.post("/auth/signup", signupRequest);
      console.log("signup response:", response.data);

      const jwt = response.data.jwt;
      localStorage.setItem("jwt", jwt);
      return jwt;
    } catch (error: any) {
      console.log("Signup error:", error);

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
  passwordChanged: boolean;
  changePasswordMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  jwt: null,
  isLoggedIn: false,
  otpSent: false,
  passwordChanged: false,
  changePasswordMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthMessage: (state) => {
      state.error = null;
      state.changePasswordMessage = null;
      state.passwordChanged = false;
    },
  },
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
      })
      .addCase(signin.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to login";
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
      })
      .addCase(signup.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to signup";
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
      .addCase(fetchUserProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to fetch user profile";
      })

      .addCase(updateProfileUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.isLoggedIn = true;
      })
      .addCase(updateProfileUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to update user";
      })

      .addCase(sendLoginSignupOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpSent = false;
      })
      .addCase(sendLoginSignupOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
        state.error = null;
      })
      .addCase(sendLoginSignupOtp.rejected, (state, action: any) => {
        state.loading = false;
        state.otpSent = false;
        state.error =
          action.payload || action.error.message || "Failed to send OTP";
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordChanged = false;
        state.changePasswordMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordChanged = true;
        state.changePasswordMessage =
          action.payload?.message || "Đổi mật khẩu thành công";
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action: any) => {
        state.loading = false;
        state.passwordChanged = false;
        state.changePasswordMessage = null;
        state.error =
          action.payload || action.error.message || "Failed to change password";
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.jwt = null;
        state.isLoggedIn = false;
        state.passwordChanged = false;
        state.changePasswordMessage = null;
      });
  },
});

export const { clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;