import { Exercise } from "../../../types/ExerciseType";
import { WorkoutPlanDay } from "../../../types/WorkoutPlanDayType";
import { WorkoutPlan } from "../../../types/WorkoutPlanType";

export type TrainingExercise = {
  id: number;
  name: string;
  focus: string;
  difficulty: string;
  videoUrl: string;
  imageUrl?: string;
  note: string;
};

export type TrainingDay = {
  id: number;
  dayLabel: string;
  title: string;
  duration: string;
  intensity: string;
  exercises: TrainingExercise[];
};

export type TrainingSchedule = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  goal: "Fat Loss" | "Muscle Gain" | "Mobility" | "Strength";
  durationWeeks: number;
  sessionsPerWeek: number;
  sessionLength: string;
  coach: string;
  cover: string;
  equipment: string[];
  schedule: string[];
  publishedAt: string;
  overview: string;
  results: string[];
  trainingDays: TrainingDay[];
  featured?: boolean;
};

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80";

const slugify = (value?: string) =>
  (value || "workout-plan")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalizeLevel = (value?: string): TrainingSchedule["level"] => {
  const level = (value || "").toUpperCase();
  if (level.includes("ADV")) return "Advanced";
  if (level.includes("INTER")) return "Intermediate";
  return "Beginner";
};

const normalizeGoal = (value?: string): TrainingSchedule["goal"] => {
  const goal = (value || "").toLowerCase();
  if (goal.includes("muscle") || goal.includes("gain") || goal.includes("hypertrophy") || goal.includes("co")) {
    return "Muscle Gain";
  }
  if (goal.includes("mobility") || goal.includes("linh") || goal.includes("recover")) {
    return "Mobility";
  }
  if (goal.includes("strength") || goal.includes("suc manh")) {
    return "Strength";
  }
  return "Fat Loss";
};

const normalizeIntensity = (value?: string) => {
  const difficulty = (value || "").toUpperCase();
  if (difficulty.includes("ADV")) return "Cao";
  if (difficulty.includes("INTER")) return "Trung binh";
  if (difficulty.includes("BEGIN")) return "Nhe";
  return value || "Vua phai";
};

const buildExerciseFocus = (exercise: Exercise) => {
  return [exercise.muscleGroupPrimary, exercise.muscleGroupSecondary]
    .filter(Boolean)
    .join(" � ");
};

const mapExercise = (exercise: Exercise): TrainingExercise => ({
  id: Number(exercise.id),
  name: exercise.name,
  focus: buildExerciseFocus(exercise) || exercise.description || "Dang cap nhat nhom co tac dong.",
  difficulty: exercise.difficultyLevel || "Co ban",
  videoUrl: exercise.videoUrl || "https://www.youtube.com/results?search_query=fitness+exercise",
  imageUrl: exercise.imageUrl,
  note: exercise.instruction || exercise.description || "Theo doi ky thuat va giu bien do on dinh trong tung rep.",
});

const mapDay = (day: WorkoutPlanDay): TrainingDay => ({
  id: Number(day.id),
  dayLabel: day.dayName || `Day ${day.dayNumber}`,
  title: day.title || day.focusMuscleGroup || `Buoi tap ngay ${day.dayNumber}`,
  duration: day.estimatedDurationMin ? `${day.estimatedDurationMin} phut` : "45 phut",
  intensity: normalizeIntensity(day.exercises?.[0]?.difficultyLevel),
  exercises: (day.exercises || []).map(mapExercise),
});

const buildResults = (plan: WorkoutPlan, days: WorkoutPlanDay[], goal: TrainingSchedule["goal"]) => {
  const base = [
    `${days.length || plan.daysPerWeek || 0} buoi tap duoc sap theo mot lich ro rang.`,
    `Theo doi tien do theo muc tieu ${goal.toLowerCase()}.`,
  ];

  if (plan.level) {
    base.push(`Phu hop cap do ${normalizeLevel(plan.level)} va co the dieu chinh theo thuc te.`);
  }

  return base;
};

export const buildTrainingSlug = (plan: WorkoutPlan) => `${slugify(plan.name)}-${plan.id}`;

export const mapWorkoutPlanToTrainingSchedule = (
  plan: WorkoutPlan,
  allDays: WorkoutPlanDay[],
): TrainingSchedule => {
  const planDays = allDays
    .filter((day) => Number(day.workoutPlan?.id) === Number(plan.id))
    .slice()
    .sort((a, b) => (a.sortOrder || a.dayNumber || 0) - (b.sortOrder || b.dayNumber || 0));

  const mappedDays = planDays.map(mapDay);
  const goal = normalizeGoal(plan.goal);
  const level = normalizeLevel(plan.level);
  const equipment = Array.from(
    new Set(
      planDays
        .flatMap((day) => day.exercises || [])
        .flatMap((exercise) => [exercise.muscleGroupPrimary, exercise.muscleGroupSecondary])
        .filter(Boolean) as string[],
    ),
  );
  const averageDuration = planDays.length
    ? Math.round(
        planDays.reduce((total, day) => total + (day.estimatedDurationMin || 0), 0) / planDays.length,
      )
    : 45;

  return {
    id: Number(plan.id),
    slug: buildTrainingSlug(plan),
    title: plan.name,
    summary:
      plan.description ||
      `Workout plan ${goal.toLowerCase()} gom ${plan.daysPerWeek || planDays.length || 0} buoi moi tuan.`,
    level,
    goal,
    durationWeeks: plan.durationWeeks || 4,
    sessionsPerWeek: plan.daysPerWeek || planDays.length || 1,
    sessionLength: `${averageDuration || 45} phut`,
    coach: plan.createdBy?.fullName || plan.createdBy?.email || "Admin Coach",
    cover:plan.cover ||planDays.flatMap((day) => day.exercises || []).find((item) => item.imageUrl)?.imageUrl ||  DEFAULT_COVER,
    equipment: equipment.length ? equipment : ["Gym co ban", "Tham tap", "Dung cu bo tro"],
    schedule: planDays.map((day) => `${day.dayName || `Day ${day.dayNumber}`} - ${day.title || day.focusMuscleGroup || "Workout"}`),
    publishedAt: plan.status || "PUBLISHED",
    overview:
      plan.description ||
      `Ke hoach tap duoc xay dung cho muc tieu ${goal.toLowerCase()}, toi uu theo so buoi tap moi tuan va cap do hien tai.`,
    results: buildResults(plan, planDays, goal),
    trainingDays: mappedDays,
    featured: Boolean(plan.isTemplate) || Number(plan.id) % 2 === 1,
  };
};

export const mapWorkoutPlansToTrainingSchedules = (
  plans: WorkoutPlan[],
  days: WorkoutPlanDay[],
) =>
  plans
    .filter((plan) => plan.status !== "ARCHIVED" && plan.status !== "DRAFT")
    .map((plan) => mapWorkoutPlanToTrainingSchedule(plan, days));

export const getTrainingBySlug = (
  slug: string,
  plans: WorkoutPlan[],
  days: WorkoutPlanDay[],
) => mapWorkoutPlansToTrainingSchedules(plans, days).find((item) => item.slug === slug);

