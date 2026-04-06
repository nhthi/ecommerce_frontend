import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchBlogTagById } from "../../../state/admin/adminBlogTagSlice";
import AddEditBlogTagForm from "./AddEditBlogTagForm";

const EditBlogTagPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { tags } = useAppSelector((store) => store.blogTag);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogTagById(Number(id)));
    }
  }, [dispatch, id]);

  const tag = tags.find((item) => item.id === Number(id));

  return <AddEditBlogTagForm initialData={tag} isEdit />;
};

export default EditBlogTagPage;
