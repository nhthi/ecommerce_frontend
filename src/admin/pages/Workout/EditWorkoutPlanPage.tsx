import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchWorkoutPlanById } from "../../../state/admin/adminWorkoutPlanSlice";
import AddEditWorkoutPlanForm from "./AddEditWorkoutPlanForm";

const EditWorkoutPlanPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { workoutPlans } = useAppSelector((store) => store.adminWorkoutPlan);

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkoutPlanById(Number(id)));
    }
  }, [dispatch, id]);

  const workoutPlan = workoutPlans.find((item) => item.id === Number(id));

  return <AddEditWorkoutPlanForm initialData={workoutPlan} isEdit />;
};

export default EditWorkoutPlanPage;
