import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchWorkoutPlanDayById } from "../../../state/admin/adminWorkoutPlanDaySlice";
import AddEditWorkoutPlanDayForm from "./AddEditWorkoutPlanDayForm";

const EditWorkoutPlanDayPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { workoutPlanDays } = useAppSelector((store) => store.adminWorkoutPlanDay);

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkoutPlanDayById(Number(id)));
    }
  }, [dispatch, id]);

  const workoutPlanDay = workoutPlanDays.find((item) => item.id === Number(id));

  return <AddEditWorkoutPlanDayForm initialData={workoutPlanDay} isEdit />;
};

export default EditWorkoutPlanDayPage;
