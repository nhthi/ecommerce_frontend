import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    borderRadius: "18px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(249,115,22,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.58)" },
  "& .MuiSelect-icon": { color: "#fb923c" },
};

const CreateDealForm = () => {
  const formik = useFormik({
    initialValues: {
      discount: 0,
      category: "",
    },
    onSubmit: (values) => {
      console.log("Form values:", values);
    },
  });

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "28px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))",
        boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
        p: { xs: 3, lg: 4 },
      }}
    >
      <Typography fontSize={28} fontWeight={800} color="white">Tao deal trang chu</Typography>
      <Typography sx={{ mt: 0.8, mb: 3, color: "rgba(255,255,255,0.62)", fontSize: 14.5 }}>
        Tao block khuyen mai nhanh cho cac nhom dung cu tap gym dang can day manh.
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} className="space-y-5">
        <TextField fullWidth name="discount" label="Muc giam (%)" type="number" value={formik.values.discount} onChange={formik.handleChange} sx={fieldSx} />
        <FormControl fullWidth sx={fieldSx}>
          <InputLabel>Danh muc</InputLabel>
          <Select name="category" value={formik.values.category} label="Danh muc" onChange={formik.handleChange}>
            <MenuItem value="weights">Ta va banh ta</MenuItem>
            <MenuItem value="cardio">May cardio</MenuItem>
            <MenuItem value="accessories">Phu kien tap</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" sx={{ borderRadius: 999, textTransform: "none", px: 2.8, background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
          Luu deal
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateDealForm;
