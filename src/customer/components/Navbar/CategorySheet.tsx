import React, { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchAllCategory } from "../../../state/admin/adminCategorySlice";

const CategorySheet = ({ selectedCategory, setShowSheet }: any) => {
  const dispatch = useAppDispatch();
  const { category } = useAppSelector((store) => store);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchAllCategory());
  }, []);

  // ✅ Lấy danh mục cấp 1, 2, 3
  const level1 = useMemo(
    () => category.categories.filter((cat) => cat.level === 1),
    [category.categories]
  );
  const level2 = useMemo(
    () => category.categories.filter((cat) => cat.level === 2),
    [category.categories]
  );
  const level3 = useMemo(
    () => category.categories.filter((cat) => cat.level === 3),
    [category.categories]
  );

  // ✅ Lấy danh mục cấp 1 đang được chọn
  const selectedParent = level1.find(
    (cat) => cat.categoryId === selectedCategory
  );

  // ✅ Lấy danh mục cấp 2 con của danh mục được chọn
  const levelTwoChildren = useMemo(() => {
    return level2.filter(
      (cat: any) =>
        cat?.parentCategory.categoryId === selectedParent?.categoryId
    );
  }, [level2, selectedParent]);

  // ✅ Hàm lọc danh mục cấp 3 con theo cấp 2
  const childCategory = (parentId: string) =>
    level3.filter((child: any) => child.parentCategory.categoryId === parentId);
  return (
    <Box
      sx={{ zIndex: 2 }}
      className="bg-white shadow-lg lg:h-[500px] overflow-y-auto"
    >
      <div className="flex text-sm flex-wrap justify-between h-full">
        {levelTwoChildren.map((item, index) => (
          <div
            className={`p-8 lg:w-[20%] ${
              index % 2 == 0 ? "bg-slate-50" : "bg-white"
            }`}
          >
            <p className="text-primary-color mb-5 font-semibold">{item.name}</p>
            <ul className="space-y-3 ">
              {childCategory(item.categoryId).map((itemChild) => (
                <div className="">
                  <li
                    onClick={() =>
                      navigate("/products/" + itemChild.categoryId)
                    }
                    className="hover:text-primary-color cursor-pointer"
                  >
                    {itemChild.name}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default CategorySheet;
