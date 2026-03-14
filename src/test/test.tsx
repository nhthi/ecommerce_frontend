import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { api } from "../config/Api";

const TryOnPage = () => {
  const [userImage, setUserImage] = useState("");
  const [clothImage, setClothImage] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTryOn = async () => {
    try {
      setLoading(true);
      setResult("");
      const res = await api.post("http://localhost:8080/api/tryon", {
        personImage: userImage,
        clothImage: clothImage,
      });
      setResult(res.data.outputUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h4" gutterBottom color="primary">
            👕 Virtual Try-On
          </Typography>

          <Box sx={{ my: 2 }}>
            <TextField
              fullWidth
              label="URL ảnh người"
              variant="outlined"
              value={userImage}
              onChange={(e) => setUserImage(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="URL ảnh quần áo"
              variant="outlined"
              value={clothImage}
              onChange={(e) => setClothImage(e.target.value)}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleTryOn}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Thử ngay"
            )}
          </Button>

          {result && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Kết quả
              </Typography>
              <img
                src={result}
                alt="Result"
                style={{
                  maxWidth: "100%",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default TryOnPage;
