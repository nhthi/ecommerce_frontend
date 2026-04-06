import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi } from "../../config/Api";
import { WorkoutPlanDay, WorkoutPlanDayFormValues, WorkoutPlanDayState } from "../../types/WorkoutPlanDayType";


export const fetchAllWorkoutPlanDays = createAsyncThunk<
  WorkoutPlanDay[],
  void,
  { rejectValue: string }
>("workoutPlanDay/fetchAllWorkoutPlanDays", async (_, { rejectWithValue }) => {
  try {
    const response = await publicApi.get("/api/workout-plan-days");
    console.log("fetch all workout plan days:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch workout plan days"
    );
  }
});

export const fetchWorkoutPlanDayById = createAsyncThunk<
  WorkoutPlanDay,
  number,
  { rejectValue: string }
>("workoutPlanDay/fetchWorkoutPlanDayById", async (id, { rejectWithValue }) => {
  try {
    const response = await publicApi.get(`/api/workout-plan-days/${id}`);
    console.log("fetch workout plan day by id:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch workout plan day"
    );
  }
});

export const fetchWorkoutPlanDaysByPlanId = createAsyncThunk<
  WorkoutPlanDay[],
  number,
  { rejectValue: string }
>(
  "workoutPlanDay/fetchWorkoutPlanDaysByPlanId",
  async (workoutPlanId, { rejectWithValue }) => {
    try {
      const response = await publicApi.get(`/api/workout-plan-days/plan/${workoutPlanId}`);
      console.log("fetch workout plan days by workout plan id:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch workout plan days by workout plan"
      );
    }
  }
);

export const createWorkoutPlanDay = createAsyncThunk<
  WorkoutPlanDay,
  { workoutPlanId: number; request: WorkoutPlanDayFormValues },
  { rejectValue: string }
>(
  "workoutPlanDay/createWorkoutPlanDay",
  async ({ workoutPlanId, request }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/workout-plan-days/plan/${workoutPlanId}`,
        request
      );
      console.log("create workout plan day:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create workout plan day"
      );
    }
  }
);

export const updateWorkoutPlanDay = createAsyncThunk<
  WorkoutPlanDay,
  { id: number; request: WorkoutPlanDayFormValues },
  { rejectValue: string }
>(
  "workoutPlanDay/updateWorkoutPlanDay",
  async ({ id, request }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/workout-plan-days/${id}`, request);
      console.log("update workout plan day:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update workout plan day"
      );
    }
  }
);

export const deleteWorkoutPlanDay = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("workoutPlanDay/deleteWorkoutPlanDay", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/workout-plan-days/${id}`);
    console.log("delete workout plan day:", id);
    return id;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to delete workout plan day"
    );
  }
});

export const addExerciseToWorkoutPlanDay = createAsyncThunk<
  WorkoutPlanDay,
  { dayId: number; exerciseId: number },
  { rejectValue: string }
>(
  "workoutPlanDay/addExerciseToWorkoutPlanDay",
  async ({ dayId, exerciseId }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/workout-plan-days/${dayId}/exercises/${exerciseId}`
      );
      console.log("add exercise to workout plan day:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to add exercise to workout plan day"
      );
    }
  }
);

export const removeExerciseFromWorkoutPlanDay = createAsyncThunk<
  WorkoutPlanDay,
  { dayId: number; exerciseId: number },
  { rejectValue: string }
>(
  "workoutPlanDay/removeExerciseFromWorkoutPlanDay",
  async ({ dayId, exerciseId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/api/workout-plan-days/${dayId}/exercises/${exerciseId}`
      );
      console.log("remove exercise from workout plan day:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to remove exercise from workout plan day"
      );
    }
  }
);

export const replaceExercisesOfWorkoutPlanDay = createAsyncThunk<
  WorkoutPlanDay,
  { dayId: number; exerciseIds: number[] },
  { rejectValue: string }
>(
  "workoutPlanDay/replaceExercisesOfWorkoutPlanDay",
  async ({ dayId, exerciseIds }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/workout-plan-days/${dayId}/exercises`,
        exerciseIds
      );
      console.log("replace exercises of workout plan day:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("error----", error);
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to replace exercises of workout plan day"
      );
    }
  }
);

const initialState: WorkoutPlanDayState = {
  workoutPlanDays: [],
  loading: false,
  error: null,
};

const adminWorkoutPlanDaySlice = createSlice({
  name: "workoutPlanDay",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllWorkoutPlanDays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWorkoutPlanDays.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlanDays = action.payload;
      })
      .addCase(fetchAllWorkoutPlanDays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch workout plan days";
      })

      .addCase(fetchWorkoutPlanDayById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutPlanDayById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workoutPlanDays.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.workoutPlanDays[index] = action.payload;
        } else {
          state.workoutPlanDays.push(action.payload);
        }
      })
      .addCase(fetchWorkoutPlanDayById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch workout plan day";
      })

      .addCase(fetchWorkoutPlanDaysByPlanId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutPlanDaysByPlanId.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlanDays = action.payload;
      })
      .addCase(fetchWorkoutPlanDaysByPlanId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch workout plan days by workout plan";
      })

      .addCase(createWorkoutPlanDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkoutPlanDay.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlanDays.push(action.payload);
      })
      .addCase(createWorkoutPlanDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create workout plan day";
      })

      .addCase(updateWorkoutPlanDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkoutPlanDay.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workoutPlanDays.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.workoutPlanDays[index] = action.payload;
        }
      })
      .addCase(updateWorkoutPlanDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update workout plan day";
      })

      .addCase(deleteWorkoutPlanDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkoutPlanDay.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlanDays = state.workoutPlanDays.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteWorkoutPlanDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete workout plan day";
      })

      .addCase(addExerciseToWorkoutPlanDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExerciseToWorkoutPlanDay.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workoutPlanDays.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.workoutPlanDays[index] = action.payload;
        } else {
          state.workoutPlanDays.push(action.payload);
        }
      })
      .addCase(addExerciseToWorkoutPlanDay.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to add exercise to workout plan day";
      })

      .addCase(removeExerciseFromWorkoutPlanDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeExerciseFromWorkoutPlanDay.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workoutPlanDays.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.workoutPlanDays[index] = action.payload;
        } else {
          state.workoutPlanDays.push(action.payload);
        }
      })
      .addCase(removeExerciseFromWorkoutPlanDay.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to remove exercise from workout plan day";
      })

      .addCase(replaceExercisesOfWorkoutPlanDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(replaceExercisesOfWorkoutPlanDay.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workoutPlanDays.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.workoutPlanDays[index] = action.payload;
        } else {
          state.workoutPlanDays.push(action.payload);
        }
      })
      .addCase(replaceExercisesOfWorkoutPlanDay.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to replace exercises of workout plan day";
      });
  },
});

export default adminWorkoutPlanDaySlice.reducer;