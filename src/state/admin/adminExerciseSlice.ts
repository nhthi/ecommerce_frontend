import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, publicApi } from "../../config/Api";
import {
  Exercise,
  ExerciseFormValues,
  ExerciseState,
} from "../../types/ExerciseType";

export const fetchAllExercises = createAsyncThunk<
  Exercise[],
  void,
  { rejectValue: string }
>("exercise/fetchAllExercises", async (_, { rejectWithValue }) => {
  try {
    const response = await publicApi.get("/api/exercises");
    console.log("fetch all exercises:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch exercises"
    );
  }
});

export const fetchExerciseById = createAsyncThunk<
  Exercise,
  number,
  { rejectValue: string }
>("exercise/fetchExerciseById", async (id, { rejectWithValue }) => {
  try {
    const response = await publicApi.get(`/api/exercises/${id}`);
    console.log("fetch exercise by id:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch exercise"
    );
  }
});

export const createExercise = createAsyncThunk<
  Exercise,
  ExerciseFormValues,
  { rejectValue: string }
>("exercise/createExercise", async (request, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/exercises", request);
    console.log("create exercise:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to create exercise"
    );
  }
});

export const updateExercise = createAsyncThunk<
  Exercise,
  { id: number; request: ExerciseFormValues },
  { rejectValue: string }
>("exercise/updateExercise", async ({ id, request }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/exercises/${id}`, request);
    console.log("update exercise:", response.data);
    return response.data;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to update exercise"
    );
  }
});

export const deleteExercise = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("exercise/deleteExercise", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/exercises/${id}`);
    console.log("delete exercise:", id);
    return id;
  } catch (error: any) {
    console.log("error----", error);
    return rejectWithValue(
      error?.response?.data?.message || "Failed to delete exercise"
    );
  }
});

const initialState: ExerciseState = {
  exercises: [],
  loading: false,
  error: null,
};

const adminExerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload;
      })
      .addCase(fetchAllExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch exercises";
      })

      .addCase(fetchExerciseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExerciseById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.exercises.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.exercises[index] = action.payload;
        } else {
          state.exercises.push(action.payload);
        }
      })
      .addCase(fetchExerciseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch exercise";
      })

      .addCase(createExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises.unshift(action.payload);
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create exercise";
      })

      .addCase(updateExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExercise.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.exercises.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.exercises[index] = action.payload;
        }
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update exercise";
      })

      .addCase(deleteExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = state.exercises.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete exercise";
      });
  },
});

export default adminExerciseSlice.reducer;