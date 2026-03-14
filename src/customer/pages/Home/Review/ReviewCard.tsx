import { Delete } from "@mui/icons-material";
import { Avatar, Box, Grid, IconButton, Rating } from "@mui/material";
import React from "react";
import { Review } from "../../../../types/OrderType";

interface ReviewCardProps {
  review: Review;
  onDelete?: (id: number) => void; // callback nếu muốn xóa
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onDelete }) => {
  return (
    <div className="flex justify-between">
      <Grid container spacing={2}>
        <Grid size={{ xs: 2 }}>
          <Box>
            <Avatar
              className="text-white"
              sx={{ width: 56, height: 56, bgcolor: "#9155FD" }}
            >
              {review.user?.fullName
                ? review.user?.fullName.charAt(0).toUpperCase()
                : ""}
            </Avatar>
          </Box>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-lg">{review.user?.fullName}</p>
              <p className="opacity-70">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <Rating readOnly value={review.rating} precision={0.5} />
          <p>{review.reviewText}</p>
          {review.productImages && review.productImages.length > 0 && (
            <div className="flex gap-2 mt-2">
              {review.productImages.map((img, idx) => (
                <img
                  key={idx}
                  alt=""
                  className="w-24 h-24 object-cover rounded"
                  src={img}
                />
              ))}
            </div>
          )}
        </Grid>
      </Grid>
      {onDelete && (
        <div>
          <IconButton onClick={() => onDelete(review.id)}>
            <Delete sx={{ color: "red" }} />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
