import { BlogUser } from "./BlogType";

export interface WorkoutPlan {
  id?: number;
  name: string;
  description?: string;
  cover?: string;
  goal?: string;
  level?: string;
  durationWeeks?: number;
  daysPerWeek?: number;
  isTemplate?: boolean;
  createdBy?: BlogUser | null;
  status?: string;
  workoutPlanDays?: any[];
}

export interface WorkoutPlanFormValues {
  name: string;
  description?: string;
  cover?: string;
  goal?: string;
  level?: string;
  durationWeeks?: number;
  daysPerWeek?: number;
  isTemplate?: boolean;
  createdBy?: {
    id: number;
  } | null;
  status?: string;
  workoutPlanDays?: any[];
}

export interface WorkoutPlanState {
  workoutPlans: WorkoutPlan[];
  loading: boolean;
  error: string | null;
}

export const GoalTypeOptions = [
  { value: "LOSE_WEIGHT", label: "Giam can" },
  { value: "GAIN_MUSCLE", label: "Tang co" },
  { value: "MAINTAIN", label: "Duy tri" },
  { value: "ENDURANCE", label: "Suc ben" },
];
