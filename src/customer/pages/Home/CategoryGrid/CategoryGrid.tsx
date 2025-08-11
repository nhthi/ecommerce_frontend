import React from "react";

const CategoryGrid = () => {
  return (
    <div className="grid gap-4 grid-rows-12 grid-cols-12 lg:h-[600px] px-5 lg:px-20">
      <div className="col-span-3 row-span-12 text-white">
        <img
          alt="category"
          src="https://cdn.pixabay.com/photo/2022/08/31/15/18/scene-7423627_1280.jpg"
          className="object-cover w-full h-full rounded-md"
        />
      </div>
      <div className="col-span-2 row-span-6 text-white">
        <img
          alt="category"
          src="https://cdn.pixabay.com/photo/2024/11/08/05/28/man-9182458_1280.jpg"
          className="object-cover w-full h-full rounded-md"
        />
      </div>
      <div className="col-span-4 row-span-6 text-white">
        <img
          alt="category"
          src="https://cdn.pixabay.com/photo/2021/07/27/01/50/ao-dai-6495619_1280.jpg"
          className="object-cover w-full h-full rounded-md"
        />
      </div>
      <div className="col-span-3 row-span-12 text-white">
        <img
          alt="category"
          src="https://cdn.pixabay.com/photo/2022/05/22/16/47/lonely-girl-in-ao-dai-7213916_1280.jpg"
          className="object-cover w-full h-full rounded-md"
        />
      </div>
      <div className="col-span-4 row-span-6 text-white">
        <img
          alt="category"
          src="https://cdn.pixabay.com/photo/2018/08/30/12/20/luxuryshoe-3642033_1280.jpg"
          className="object-cover w-full h-full rounded-md"
        />
      </div>
      <div className="col-span-2 row-span-6 text-white">
        <img
          alt="category"
          src="https://cdn.pixabay.com/photo/2017/08/27/05/33/suit-2685226_1280.jpg"
          className="object-cover w-full h-full rounded-md"
        />
      </div>
    </div>
  );
};

export default CategoryGrid;
