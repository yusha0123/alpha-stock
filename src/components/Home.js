import {
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Box,
  Tooltip,
  Avatar,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Swal from "sweetalert2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../fireConfig";
import StarIcon from "@mui/icons-material/Star";
import CreateChart from "./CreateChart";
import Grid from "@mui/material/Grid";
import TableHead from "@mui/material/TableHead";

function Home() {
  const [symbol, setsymbol] = useState("");
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [loading, isLoading] = useState(false);
  const [stockName, setStockName] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
  const [add, setAdd] = useState(false);
  const [dbItems, setDbItems] = useState([]);
  const docRef = doc(firestore, "users", auth.currentUser.uid);
  const [logoUrl, setLogoUrl] = useState();

  useEffect(() => {
    const unsubsribe = onSnapshot(docRef, (doc) => {
      setDbItems(doc.data());
    });

    return () => {
      unsubsribe();
    };
    // eslint-disable-next-line
  }, []);

  const handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      document.getElementById("search").click();
    }
  };

  const insertIntoDatabase = async () => {
    setAdd(true);
    await updateDoc(docRef, {
      portfolio: arrayUnion({
        Name: stockName,
        stockSymbol: stockSymbol,
        previous_price: data[7].value,
        date_added: new Date().toLocaleString(),
      }),
    });
  };

  const removeFromDatabase = async () => {
    const filteredObject = dbItems.portfolio.filter(function (obj) {
      return obj.stockSymbol !== stockSymbol;
    });
    try {
      await updateDoc(docRef, {
        portfolio: filteredObject,
      });
      setAdd(false);
    } catch (error) {
      console.log(error);
    }
  };

  const apiCall = async () => {
    setData({});
    setFlag(false);
    isLoading(true);
    let response1 = await fetch(
      `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${process.env.REACT_APP_TWELVE_KEY_1}`
    );
    let response2 = await fetch(
      `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${process.env.REACT_APP_TWELVE_KEY_1}`
    );
    let response3 = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.REACT_APP_FINHUB_KEY}`
    );
    let json1 = await response1.json();
    let json2 = await response2.json();
    let json3 = await response3.json();

    if (json1.code === 400 || json2.code === 400) {
      Swal.fire("Invalid Stock Symbol!", "", "error");
    } else {
      setStockName(json1.name);
      setStockSymbol(json1.symbol);
      setAdd(false);
      if (json3.code !== {}) {
        setLogoUrl(json3.logo);
      }

      for (let i = 0; i < dbItems.portfolio.length; i++) {
        let stock = dbItems.portfolio[i];
        if (stock.stockSymbol === json1.symbol) {
          setAdd(true);
        }
      }

      setData([
        {
          item: "Date",
          value: json1.datetime,
        },
        {
          item: "Last Updated",
          value: new Date(json1.timestamp * 1000).toLocaleTimeString("en-US"),
        },
        {
          item: "Exchange",
          value: json1.exchange,
        },
        {
          item: "Open",
          value: json1.open,
        },
        {
          item: "High",
          value: json1.high,
        },
        {
          item: "Low",
          value: json1.low,
        },
        {
          item: "Close",
          value: json1.close,
        },
        {
          item: "Price",
          value: json2.price,
        },
        {
          item: "Previous Close",
          value: json1.previous_close,
        },
        {
          item: "Change",
          value: json1.change,
        },
        {
          item: "Fifty Two Week High",
          value: json1.fifty_two_week.high,
        },
        {
          item: "Fifty Two Week Low",
          value: json1.fifty_two_week.low,
        },
      ]);

      setFlag(true);
    }
    isLoading(false);
  };

  return (
    <>
      <Stack
        direction="column"
        gap={4}
        sx={{ width: { xs: "90%", sm: "80%", md: "50%", lg: "40%" } }}
        mx="auto"
      >
        <TextField
          fullWidth
          value={symbol}
          onChange={(e) => setsymbol(e.target.value)}
          placeholder="Enter Stock Symbol"
          onKeyDown={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="large"
                  onClick={apiCall}
                  disabled={loading || !symbol}
                  id="search"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Stack>
      {loading && (
        <Stack alignItems="center" mt={5}>
          <CircularProgress />
        </Stack>
      )}
      {flag && (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            columnGap={2}
            sx={{
              padding: 2,
            }}
          >
            {logoUrl ? (
              <Avatar
                src={logoUrl}
                sx={{ width: 50, height: 50 }}
                variant="rounded"
              ></Avatar>
            ) : (
              <></>
            )}
            <h1 style={{ fontSize: "22px" }}>
              {stockName} ({stockSymbol})
            </h1>
            {add ? (
              <Tooltip title="Remove from Portfolio">
                <IconButton onClick={removeFromDatabase}>
                  <StarIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Add to Portfolio">
                <IconButton onClick={insertIntoDatabase}>
                  <StarBorderIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Grid container spacing={1} mb={8}>
            <Grid item xs={12} md={4} lg={3} xl={2}>
              <Box mx={{ xs: "7vw", md: "4vw", lg: "1.5vw", xl: "1vw" }}>
                <TableContainer
                  component={Paper}
                  sx={{ backgroundColor: "rgb(226 232 240)" }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" colSpan={2}>
                          <h3>Price Statistics</h3>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((row) => (
                        <TableRow
                          key={row.item}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.item}
                          </TableCell>
                          <TableCell align="right">
                            <b>{row.value}</b>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
            <Grid item xs={12} md={8} lg={9} xl={10}>
              <CreateChart symbol={stockSymbol} />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

export default Home;
