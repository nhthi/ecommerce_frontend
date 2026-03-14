import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../state/Store";
import { fetchTransactionsBySeller } from "../../../state/seller/transactionSlice";
import { format } from "date-fns";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0097e6",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Transaction() {
  const dispatch = useAppDispatch();

  const { transaction } = useAppSelector((store) => store);

  React.useEffect(() => {
    dispatch(fetchTransactionsBySeller());
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell align="left">Customer Details</StyledTableCell>
            <StyledTableCell align="right">Order</StyledTableCell>
            <StyledTableCell align="right">Amount</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transaction.transactions.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {format(new Date(row.date), "dd/MM/yyyy HH:mm")}
              </StyledTableCell>
              <StyledTableCell align="left">
                {row?.customer?.email}
              </StyledTableCell>
              <StyledTableCell align="right">{row.order.id}</StyledTableCell>
              <StyledTableCell align="right">
                ${row.order.totalPrice}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
