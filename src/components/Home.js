import {
  CircularProgress,
  Paper,
  TextField,
  Box,
  Tooltip,
  Avatar,
  Snackbar,
  Alert,
  Table,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Swal from "sweetalert2";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
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
  const [symbol, setSymbol] = useState();
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [loading, isLoading] = useState(false);
  const [stockName, setStockName] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [add, setAdd] = useState(false);
  const [dbItems, setDbItems] = useState([]);
  const docRef = doc(firestore, "users", auth.currentUser.uid);
  const [logoUrl, setLogoUrl] = useState();
  const message = useRef("");
  const [gainers, setGainers] = useState([]);
  const [showHomeData, setShowHomeData] = useState(true);
  const SymbolRef = useRef();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  useEffect(() => {
    const unsubsribe = onSnapshot(docRef, (doc) => {
      setDbItems(doc.data());
    });

    return () => {
      unsubsribe();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getGainers = () => {
      isLoading(true);
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "e4d1d3d92bmsha21bbac92ddfff9p1b78b5jsn6fe0099b46ee",
          "X-RapidAPI-Host": "ms-finance.p.rapidapi.com",
        },
      };
      fetch("https://ms-finance.p.rapidapi.com/market/v2/get-movers", options)
        .then((response) => response.json())
        .then((response) => {
          isLoading(false);
          setGainers(response.gainers);
        })
        .catch((err) => console.error(err));
    };
    getGainers();
  }, []);

  const handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      document.getElementById("search").click();
    }
  };

  const insertIntoDatabase = async () => {
    try {
      await updateDoc(docRef, {
        portfolio: arrayUnion({
          Name: stockName,
          stockSymbol: stockSymbol,
          previous_price: data[6].value,
          date_added: new Date().toLocaleString(),
        }),
      });
      setAdd(true);
      setOpenSnack(true);
      message.current = "Stock added to your Portfolio!";
    } catch (error) {
      console.log(error);
      setOpenSnack(true);
      message.current = "Something Went Wrong!";
    }
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
      setOpenSnack(true);
      message.current = "Stock removed from your Portfolio!";
    } catch (error) {
      console.log(error);
      setOpenSnack(true);
      message.current = "Something Went Wrong!";
    }
  };

  const apiCall = async () => {
    setData({});
    setFlag(false);
    setShowHomeData(false);
    isLoading(true);
    let response1 = await fetch(
      `https://api.twelvedata.com/quote?symbol=${
        symbol ? symbol.trim() : SymbolRef.current
      }&apikey=${process.env.REACT_APP_TWELVE_KEY_1}`
    );
    let response2 = await fetch(
      `https://api.twelvedata.com/price?symbol=${
        symbol ? symbol.trim() : SymbolRef.current
      }&apikey=${process.env.REACT_APP_TWELVE_KEY_1}`
    );
    let response3 = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${
        symbol ? symbol.trim() : SymbolRef.current
      }&token=${process.env.REACT_APP_FINHUB_KEY}`
    );
    let json1 = await response1.json();
    let json2 = await response2.json();
    let json3 = await response3.json();

    if (json1.code === 400 || json2.code === 400) {
      Swal.fire("Invalid Stock Symbol!", "", "error");
      setShowHomeData(true);
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
      <Snackbar
        open={openSnack}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setOpenSnack(false)}
      >
        <Alert
          onClose={() => setOpenSnack(false)}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message.current}
        </Alert>
      </Snackbar>
      <Box
        sx={{ width: { xs: "90%", sm: "80%", md: "50%", lg: "40%" } }}
        mx="auto"
      >
        <TextField
          fullWidth
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          autoComplete="off"
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
      </Box>
      {showHomeData && (
        <Box
          sx={{ width: { xs: "90%", md: "80%", lg: "75%" } }}
          mx="auto"
          my={2}
        >
          <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
            Top Gainers in the Market
          </h2>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">
                    <h3>Name</h3>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <h3>Symbol</h3>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <h3>Volume</h3>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <h3>Last Price</h3>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <h3>% Change</h3>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gainers.map((row) => (
                  <TableRow
                    key={row.ticker}
                    onClick={() => {
                      SymbolRef.current = row.ticker;
                      apiCall();
                    }}
                    sx={{
                      cursor: "pointer",
                      ":hover": {
                        backgroundColor: " #EEEEEE",
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.ticker}</TableCell>
                    <TableCell align="center">{row.volume}</TableCell>
                    <TableCell align="center">{row.lastPrice}</TableCell>
                    <TableCell align="center">{row.percentNetChange}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {loading && (
        <Box position="absolute" top="50%" left="50%">
          <CircularProgress />
        </Box>
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
            {logoUrl && (
              <Avatar
                src={logoUrl}
                sx={{ width: 50, height: 50 }}
                variant="rounded"
              />
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
            <Grid item xs={12} md={4} lg={3}>
              <Box width="90%" mx="auto">
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
            <Grid item xs={12} md={8} lg={9}>
              <CreateChart symbol={stockSymbol} />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

export default Home;
