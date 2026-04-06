import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchBlogPostById } from "../../../state/admin/adminBlogPostSlice";
import AddEditBlogPostForm from "./AddEditBlogPostForm";

const EditBlogPostPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { posts } = useAppSelector((store) => store.blogPost);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogPostById(Number(id)));
    }
  }, [dispatch, id]);

  const post = posts.find((item) => item.id === Number(id));

  return <AddEditBlogPostForm initialData={post} isEdit />;
};

export default EditBlogPostPage;
