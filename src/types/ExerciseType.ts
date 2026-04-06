export interface Exercise {
  id?: number;
  name: string;
  slug?: string;
  description?: string;
  instruction?: string;
  muscleGroupPrimary?: string;
  muscleGroupSecondary?: string;
  difficultyLevel?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export type ExerciseFormValues = Omit<Exercise, "id">;

export interface ExerciseState {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
}