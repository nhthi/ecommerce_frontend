import * as React from "react";
import { Box, IconButton, Paper, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DeleteOutline, Edit } from "@mui/icons-material";

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
  { id: 1, title: "Flash sale ta tay", image: "Banner 1", target: "Ta tay", value: "20%" },
  { id: 2, title: "Combo yoga", image: "Banner 2", target: "Yoga", value: "15%" },
  { id: 3, title: "Deal phu kien gym", image: "Banner 3", target: "Phu kien", value: "10%" },
];

export default function DealTable() {
  return (
    <Paper elevation={0} sx={{ borderRadius: "28px", border: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(20,20,20,0.98), rgba(12,12,12,0.99))", boxShadow: "0 24px 60px rgba(0,0,0,0.28)", overflow: "hidden" }}>
      <Box sx={{ px: 3, py: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Typography fontSize={24} fontWeight={800} color="white">Danh sach deal</Typography>
        <Typography sx={{ mt: 0.6, color: "rgba(255,255,255,0.62)", fontSize: 14 }}>Cac block khuyen mai dang hien thi tren trang chu.</Typography>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 780 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Tieu de</StyledTableCell>
              <StyledTableCell>Hinh anh</StyledTableCell>
              <StyledTableCell>Danh muc</StyledTableCell>
              <StyledTableCell>Muc giam</StyledTableCell>
              <StyledTableCell align="center">Sua</StyledTableCell>
              <StyledTableCell align="center">Xoa</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.title}</StyledTableCell>
                <StyledTableCell>{row.image}</StyledTableCell>
                <StyledTableCell>{row.target}</StyledTableCell>
                <StyledTableCell>{row.value}</StyledTableCell>
                <StyledTableCell align="center"><IconButton sx={{ color: "#fdba74" }}><Edit /></IconButton></StyledTableCell>
                <StyledTableCell align="center"><IconButton sx={{ color: "#fca5a5" }}><DeleteOutline /></IconButton></StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
