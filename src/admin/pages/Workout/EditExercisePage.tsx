import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchExerciseById } from "../../../state/admin/adminExerciseSlice";
import AddEditExerciseForm from "./AddEditExerciseForm";

const TrangChinhSuaBaiTap = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { exercises } = useAppSelector((store) => store.adminExercise);

  useEffect(() => {
    if (id) {
      dispatch(fetchExerciseById(Number(id)));
    }
  }, [dispatch, id]);

  const baiTap = exercises.find((item) => item.id === Number(id));

  return <AddEditExerciseForm initialData={baiTap} isEdit />;
};

export default TrangChinhSuaBaiTap;