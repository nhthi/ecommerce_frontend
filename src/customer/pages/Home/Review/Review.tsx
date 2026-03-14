import React, { useMemo } from "react";
import ReviewCard from "./ReviewCard";
import { Divider, Grid, LinearProgress, Rating } from "@mui/material";
import { Review as ReviewType } from "../../../../types/OrderType";
import { Product } from "../../../../types/ProductType";
import { Star } from "@mui/icons-material";
import { formatCurrencyVND } from "../../../../utils/formatCurrencyVND";

interface ReviewProps {
  reviews: ReviewType[];
  product: Product | null;
}

const Review: React.FC<ReviewProps> = ({ reviews, product }) => {
  // Tính tổng số review và phân loại theo rating
  const ratingSummary = useMemo(() => {
    const summary: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      summary[r.rating] = (summary[r.rating] || 0) + 1;
    });
    const total = reviews.length;
    const percent: Record<number, number> = {};
    Object.keys(summary).forEach((key) => {
      const k = parseInt(key);
      percent[k] = total ? (summary[k] / total) * 100 : 0;
    });
    return { summary, percent, total };
  }, [reviews]);

  // Tính rating trung bình
  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return total / reviews.length;
  }, [reviews]);
  const starColors: Record<number, string> = {
    5: "#3b82f6", // xanh dương
    4: "#60a5fa", // xanh pastel
    3: "#fbbf24", // vàng
    2: "#fb923c", // cam
    1: "#f87171", // đỏ
  };
  return (
    <div className="p-5 lg:px-20 flex flex-col lg:flex-row gap-20">
      {product && (
        <section className="w-full md:w-1/2 lg:w-[30%] space-y-2">
          <img alt="" src={product.images[0] || ""} className="" />
          <div>
            <div>
              <p className="font-bold text-xl">
                {product.seller?.businessDetails.businessName}
              </p>
              <p className="text-lg text-gray-600">{product.title}</p>
            </div>
            <div className="price flex items-center gap-3 mt-5 text-xl">
              <span className="font-sans text-gray-800">
                {formatCurrencyVND(product.sellingPrice)}
              </span>
              <span className="thin-line-through text-gray-400">
                {formatCurrencyVND(product.mrpPrice)}
              </span>
              <span className="text-primary-color font-semibold">
                {product.discountPercent}%
              </span>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-10 w-full">
        <div>
          <h1 className="font-semibold">Đánh giá từ khách hàng</h1>
          <div className="py-5 border my-5 shadow-xl">
            <div className="flex items-center gap-2 px-5">
              <Rating readOnly value={averageRating} precision={0.1} />
              <span className="font-thin">{averageRating.toFixed(1)} / 5</span>
              <span className="font-thin text-gray-500 ml-2">
                ({ratingSummary.total} đánh giá)
              </span>
            </div>
            <div className="space-y-3 mt-10 px-10 font-thin">
              {[5, 4, 3, 2, 1].map((star) => (
                <Grid
                  container
                  spacing={2}
                  key={star}
                  className="flex items-center"
                >
                  <Grid size={{ xs: 2 }}>
                    <span className="flex items-center gap-1">
                      {star} <Star sx={{ color: starColors[star] }} />
                    </span>
                  </Grid>
                  <Grid size={{ xs: 7 }}>
                    <LinearProgress
                      sx={{
                        borderRadius: 4,
                        height: 7,
                        bgcolor: "#e0e0e0",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          backgroundImage: starColors[star],
                        },
                      }}
                      variant="determinate"
                      value={ratingSummary.percent[star]} // % đánh giá cho mỗi sao
                    />
                  </Grid>
                  <Grid size={{ xs: 2 }}>
                    <span>{ratingSummary.summary[star]}</span>
                  </Grid>
                </Grid>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5 w-full">
          {reviews?.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="space-y-3">
                <ReviewCard review={review} />
                <Divider />
              </div>
            ))
          ) : (
            <p className="text-gray-500">Chưa có đánh giá nào.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Review;
