import React from "react";
import ReviewCard from "./ReviewCard";
import { Divider, Grid, LinearProgress, Rating } from "@mui/material";

const Review = () => {
  return (
    <div className="p-5 lg:px-20 flex flex-col lg:flex-row gap-20">
      <section className="w-full md:w-1/2 lg:w-[30%] space-y-2">
        <img
          alt=""
          src="https://product.hstatic.net/1000213281/product/7_361ffc0521b54448b669be82acf99513.jpg"
          className=""
        />
        <div>
          <div>
            <p className="font-bold text-xl">Raam Clothing</p>
            <p className="text-lg text-gray-600">Men's White Shirt</p>
          </div>
          <div className="price flex items-center gap-3 mt-5 text-xl">
            <span className="font-sans text-gray-800">$ 400</span>
            <span className="thin-line-through text-gray-400">$ 999</span>
            <span className="text-primary-color font-semibold">60%</span>
          </div>
        </div>
      </section>

      <section className="space-y-10 w-full">
        <div>
          <h1 className="font-semibold">Review & Ratings</h1>
          <div className="py-5 border my-5 shadow-xl">
            <div className="flex items-center gap-2 px-5">
              <Rating readOnly value={4.5} precision={0.5} />
              <span className="font-thin">Ratings</span>
            </div>
            <div className="space-y-5 mt-10 px-10 font-thin">
              <Grid container spacing={2} className="flex items-center">
                <Grid size={{ xs: 2 }}>
                  <span>Excellent</span>
                </Grid>
                <Grid size={{ xs: 7 }}>
                  <LinearProgress
                    sx={{ borderRadius: 4, height: 7, bgcolor: "#d0d0d0" }}
                    variant="determinate"
                    color="success"
                    value={70}
                  />
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <span>19259</span>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="flex items-center">
                <Grid size={{ xs: 2 }}>
                  <span>Excellent</span>
                </Grid>
                <Grid size={{ xs: 7 }}>
                  <LinearProgress
                    sx={{ borderRadius: 4, height: 7, bgcolor: "#d0d0d0" }}
                    variant="determinate"
                    color="warning"
                    value={50}
                  />
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <span>19259</span>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="flex items-center">
                <Grid size={{ xs: 2 }}>
                  <span>Excellent</span>
                </Grid>
                <Grid size={{ xs: 7 }}>
                  <LinearProgress
                    sx={{ borderRadius: 4, height: 7, bgcolor: "#d0d0d0" }}
                    variant="determinate"
                    color="error"
                    value={10}
                  />
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <span>19259</span>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="flex items-center">
                <Grid size={{ xs: 2 }}>
                  <span>Excellent</span>
                </Grid>
                <Grid size={{ xs: 7 }}>
                  <LinearProgress
                    sx={{ borderRadius: 4, height: 7, bgcolor: "#d0d0d0" }}
                    variant="determinate"
                    color="error"
                    value={70}
                  />
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <span>19259</span>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="flex items-center">
                <Grid size={{ xs: 2 }}>
                  <span>Excellent</span>
                </Grid>
                <Grid size={{ xs: 7 }}>
                  <LinearProgress
                    sx={{ borderRadius: 4, height: 7, bgcolor: "#d0d0d0" }}
                    variant="determinate"
                    color="error"
                    value={70}
                  />
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <span>19259</span>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
        <div className="space-y-5 w-full">
          {[1, 1, 1, 1, 1, 1, 1, 1].map((item) => (
            <div className="space-y-3">
              <ReviewCard />
              <Divider />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Review;
