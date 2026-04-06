import { Delete, Close, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  Rating,
  Dialog,
} from "@mui/material";
import React, { useState } from "react";
import { Review } from "../../../../types/OrderType";

interface ReviewCardProps {
  review: Review;
  onDelete?: (id: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleOpen = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const nextImage = () => {
    if (!review.productImages) return;
    setActiveIndex((prev) =>
      prev === review.productImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!review.productImages) return;
    setActiveIndex((prev) =>
      prev === 0 ? review.productImages.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 gap-4">
          <Avatar
            className="shrink-0 text-white"
            sx={{ width: 56, height: 56, bgcolor: "#9155FD" }}
          >
            {review.user?.fullName
              ? review.user.fullName.charAt(0).toUpperCase()
              : ""}
          </Avatar>

          <div className="flex-1">
            <div className="mb-2">
              <p className="text-lg font-semibold text-white">
                {review.user?.fullName}
              </p>
              <p className="text-sm opacity-70">
                {new Date(review.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>

            <Rating readOnly value={review.rating} precision={0.5} />

            <p className="mt-2 break-words text-white">
              {review.reviewText}
            </p>

            {review.productImages && review.productImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {review.productImages.map((img, idx) => (
                  <img
                    key={idx}
                    alt=""
                    onClick={() => handleOpen(idx)}
                    className="h-24 w-24 cursor-pointer rounded object-cover hover:scale-105 transition"
                    src={img}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {onDelete && (
          <IconButton onClick={() => onDelete(review.id)}>
            <Delete sx={{ color: "red" }} />
          </IconButton>
        )}
      </div>

      {/* 🔥 Modal xem ảnh */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <div className="relative bg-black">
          {/* nút đóng */}
          <IconButton
            onClick={handleClose}
            className="!absolute top-2 right-2 z-10"
          >
            <Close sx={{ color: "white" }} />
          </IconButton>

          {/* nút prev */}
          {review.productImages && review.productImages.length > 1 && (
            <IconButton
              onClick={prevImage}
              className="!absolute left-2 top-1/2 -translate-y-1/2 z-10"
            >
              <ArrowBackIos sx={{ color: "white" }} />
            </IconButton>
          )}

          {/* ảnh */}
          <img
            src={review.productImages?.[activeIndex]}
            className="max-h-[80vh] max-w-[90vw] object-contain"
            alt=""
          />

          {/* nút next */}
          {review.productImages && review.productImages.length > 1 && (
            <IconButton
              onClick={nextImage}
              className="!absolute right-2 top-1/2 -translate-y-1/2 z-10"
            >
              <ArrowForwardIos sx={{ color: "white" }} />
            </IconButton>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default ReviewCard;