import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../fireConfig";
import { Tooltip } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

function Portfolio() {
  const [dbItems, setDbItems] = useState([]);
  const docRef = doc(firestore, "users", auth.currentUser.uid);
  const [updatePrice, setUpdatePrice] = useState({});
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  useEffect(() => {
    const unsubsribe = onSnapshot(docRef, (doc) => {
      setDbItems(doc.data()?.portfolio);
    });

    return () => {
      unsubsribe();
    };
    // eslint-disable-next-line
  }, []);

  const fetchCurrentPrice = async (symbol) => {
    let response = await fetch(
      `https://api.twelvedata.com/price?symbol=${symbol}&apikey=bd1e303848234405917a5753b234bbb5`
    );
    let json = await response.json();

    if (json.code !== 400) {
      setUpdatePrice({ ...updatePrice, [symbol]: json.price });
    }
  };

  const deleteData = async (symbol) => {
    const filteredObject = dbItems.filter(function (obj) {
      return obj.stockSymbol !== symbol;
    });
    try {
      await updateDoc(docRef, {
        portfolio: filteredObject,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ width: "90%", mb: "50px", mx: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="center">Symbol</StyledTableCell>
              <StyledTableCell align="center">Added At</StyledTableCell>
              <StyledTableCell align="center">Previous Price</StyledTableCell>
              <StyledTableCell align="center">Current Price</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dbItems.length !== 0 ? (
              dbItems.map((item) => (
                <StyledTableRow key={item.stockSymbol}>
                  <StyledTableCell component="th" scope="row">
                    {item.Name}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {item.stockSymbol}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {item.date_added}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {item.previous_price}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {updatePrice[item.stockSymbol] ? (
                      updatePrice[item.stockSymbol]
                    ) : (
                      <Button
                        onClick={() => fetchCurrentPrice(item.stockSymbol)}
                        size="small"
                        variant="contained"
                      >
                        Fetch
                      </Button>
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Remove from Portfolio">
                      <IconButton onClick={() => deleteData(item.stockSymbol)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  <b>There are 0 items currently in your Portfolio</b>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Portfolio;
