import { Delete } from "@mui/icons-material";
import { Avatar, Box, Grid, IconButton, Rating } from "@mui/material";
import React from "react";

const ReviewCard = () => {
  return (
    <div className="flex justify-between">
      <Grid container spacing={10}>
        <Grid size={{ xs: 1 }}>
          <Box>
            <Avatar
              className="text-white"
              sx={{ width: 56, height: 56, bgcolor: "#9155FD" }}
            >
              Z
            </Avatar>
          </Box>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-lg">Zosh</p>
              <p className="opacity-70">2024-09-02 16:07</p>
            </div>
          </div>
          <Rating readOnly value={4.5} precision={0.5} />
          <p>Value for money product, great product</p>
          <div>
            <img
              alt=""
              className="w-24 h-24 object-cover "
              src="https://cdn.chiaki.vn/unsafe/0x960/left/top/smart/filters:quality(75)/https://chiaki.vn/upload/product/2022/08/ao-the-thao-3-lo-cho-nam-gymshark-62e9dc120a189-03082022092314.jpg"
            />
          </div>
        </Grid>
      </Grid>
      <div>
        <IconButton>
          <Delete sx={{ color: "red" }} />
        </IconButton>
      </div>
    </div>
  );
};

export default ReviewCard;
