import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchBlogCategoryById } from "../../../state/admin/adminBlogCategorySlice";
import AddEditBlogCategoryForm from "./AddEditBlogCategoryForm";

const EditBlogCategoryPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((store) => store.blogCategory);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogCategoryById(Number(id)));
    }
  }, [dispatch, id]);

  const category = categories.find((item) => item.id === Number(id));

  return <AddEditBlogCategoryForm initialData={category} isEdit />;
};

export default EditBlogCategoryPage;