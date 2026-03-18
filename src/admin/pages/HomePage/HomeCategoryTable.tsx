import * as React from "react";
import { Box, IconButton, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Edit } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#171717",
    color: "#fed7aa",
    borderBottomColor: "rgba(249,115,22,0.22)",
    fontWeight: 700,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  [`&.${tableCellClasses.body}`]: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
});

const StyledTableRow = styled(TableRow)({
  "&:hover": { backgroundColor: "rgba(249,115,22,0.05)" },
});

const rows = [
  { id: 1, image: "Category cover 1", name: "Ta tay" },
  { id: 2, image: "Category cover 2", name: "Yoga" },
  { id: 3, image: "Category cover 3", name: "May cardio" },
];

export default function HomeCategoryTable() {
  return (
    <Paper elevation={0} sx={{ borderRadius: "28px", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))", boxShadow: "0 24px 60px rgba(0,0,0,0.28)", overflow: "hidden" }}>
      <Box sx={{ px: 3, py: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Typography fontSize={24} fontWeight={800} color="white">Khoi danh muc trang chu</Typography>
        <Typography sx={{ mt: 0.6, color: "rgba(255,255,255,0.62)", fontSize: 14 }}>Cac o danh muc dang hien tren giao dien khach hang.</Typography>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Hinh anh</StyledTableCell>
              <StyledTableCell>Danh muc</StyledTableCell>
              <StyledTableCell align="center">Cap nhat</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.id}</StyledTableCell>
                <StyledTableCell>{row.image}</StyledTableCell>
                <StyledTableCell>{row.name}</StyledTableCell>
                <StyledTableCell align="center"><IconButton sx={{ color: "#fdba74" }}><Edit /></IconButton></StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
