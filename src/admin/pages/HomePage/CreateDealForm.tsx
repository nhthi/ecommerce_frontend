import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";

const CreateDealForm = () => {
  const formik = useFormik({
    initialValues: {
      discount: 0,
      category: "",
    },
    onSubmit: (values) => {
      // Handle form submission
      console.log("Form values:", values);
    },
  });
  return (
    <Box
      component={"form"}
      onSubmit={formik.handleSubmit}
      sx={{ padding: 2 }}
      className="space-y-6"
    >
      <Typography variant="h4" className="text-center">
        Create Deal
      </Typography>

      <TextField
        fullWidth
        name="discount"
        label="Discount"
        value={formik.values.discount}
        onChange={formik.handleChange}
        error={formik.touched.discount && Boolean(formik.errors.discount)}
        helperText={formik.touched.discount && formik.errors.discount}
      />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formik.values.category}
          label="Category"
          onChange={formik.handleChange}
        >
          {/* {accountStatuses.map((status) => (
            <MenuItem key={status.status} value={status.status}>
              {status.title}
            </MenuItem>
          ))} */}
        </Select>
      </FormControl>
      <Button
        fullWidth
        sx={{ py: ".8rem" }}
        type="submit"
        variant="contained"
        color="primary"
      >
        Create Deal
      </Button>
    </Box>
  );
};

export default CreateDealForm;
