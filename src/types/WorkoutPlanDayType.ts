import { Exercise } from "./ExerciseType";

export interface WorkoutPlanDay {
  id?: number;
  workoutPlan?: any;
  dayNumber: number;
  dayName?: string;
  title?: string;
  focusMuscleGroup?: string;
  estimatedDurationMin?: number;
  note?: string;
  sortOrder?: number;
  exercises?: Exercise[];
}

export type WorkoutPlanDayFormValues = Omit<WorkoutPlanDay, "id">;

export interface WorkoutPlanDayState {
  workoutPlanDays: WorkoutPlanDay[];
  loading: boolean;
  error: string | null;
}