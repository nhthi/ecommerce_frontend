import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi } from "../../config/Api";
import {
  WorkoutPlan,
  WorkoutPlanFormValues,
  WorkoutPlanState,
} from "../../types/WorkoutPlanType";

export const fetchAllWorkoutPlans = createAsyncThunk<
  WorkoutPlan[],
  void,
  { rejectValue: string }
>("workoutPlan/fetchAllWorkoutPlans", async (_, { rejectWithValue }) => {
  try {
    const response = await publicApi.get("/api/workout-plans");
    console.log("fetch all workout plans:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch workout plans"
    );
  }
});

export const fetchWorkoutPlanById = createAsyncThunk<
  WorkoutPlan,
  number,
  { rejectValue: string }
>("workoutPlan/fetchWorkoutPlanById", async (id, { rejectWithValue }) => {
  try {
    const response = await publicApi.get(`/api/workout-plans/${id}`);
    console.log("fetch workout plan by id:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch workout plan"
    );
  }
});

export const fetchWorkoutPlanTemplates = createAsyncThunk<
  WorkoutPlan[],
  void,
  { rejectValue: string }
>("workoutPlan/fetchWorkoutPlanTemplates", async (_, { rejectWithValue }) => {
  try {
    const response = await publicApi.get("/api/workout-plans/templates");
    console.log("fetch workout plan templates:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch workout plan templates"
    );
  }
});

export const fetchWorkoutPlansByUserId = createAsyncThunk<
  WorkoutPlan[],
  number,
  { rejectValue: string }
>("workoutPlan/fetchWorkoutPlansByUserId", async (userId, { rejectWithValue }) => {
  try {
    const response = await publicApi.get(`/api/workout-plans/user/${userId}`);
    console.log("fetch workout plans by user id:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch workout plans by user"
    );
  }
});

export const createWorkoutPlan = createAsyncThunk<
  WorkoutPlan,
  WorkoutPlanFormValues,
  { rejectValue: string }
>("workoutPlan/createWorkoutPlan", async (request, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/workout-plans", request);
    console.log("create workout plan:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to create workout plan"
    );
  }
});

export const updateWorkoutPlan = createAsyncThunk<
  WorkoutPlan,
  { id: number; request: WorkoutPlanFormValues },
  { rejectValue: string }
>("workoutPlan/updateWorkoutPlan", async ({ id, request }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/workout-plans/${id}`, request);
    console.log("update workout plan:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to update workout plan"
    );
  }
});

export const deleteWorkoutPlan = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("workoutPlan/deleteWorkoutPlan", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/workout-plans/${id}`);
    console.log("delete workout plan:", id);
    return id;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to delete workout plan"
    );
  }
});

const initialState: WorkoutPlanState = {
  workoutPlans: [],
  loading: false,
  error: null,
};

const adminWorkoutPlanSlice = createSlice({
  name: "workoutPlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllWorkoutPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWorkoutPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlans = action.payload;
      })
      .addCase(fetchAllWorkoutPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch workout plans";
      })

      .addCase(fetchWorkoutPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutPlanById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workoutPlans.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.workoutPlans[index] = action.payload;
        } else {
          state.workoutPlans.push(action.payload);
        }
      })
      .addCase(fetchWorkoutPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch workout plan";
      })

      .addCase(fetchWorkoutPlanTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutPlanTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlans = action.payload;
      })
      .addCase(fetchWorkoutPlanTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch workout plan templates";
      })

      .addCase(fetchWorkoutPlansByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutPlansByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlans = action.payload;
      })
      .addCase(fetchWorkoutPlansByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch workout plans by user";
      })

      .addCase(createWorkoutPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkoutPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlans.unshift(action.payload);
      })
      .addCase(createWorkoutPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create workout plan";
      })

      .addCase(updateWorkoutPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkoutPlan.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workoutPlans.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.workoutPlans[index] = action.payload;
        }
      })
      .addCase(updateWorkoutPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update workout plan";
      })

      .addCase(deleteWorkoutPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkoutPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlans = state.workoutPlans.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteWorkoutPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete workout plan";
      });
  },
});

export default adminWorkoutPlanSlice.reducer;