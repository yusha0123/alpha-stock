import React from "react";
import { Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { ReactComponent as Logo } from "../utils/root.svg";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";

const Root = () => {
  const StyledButton1 = styled(Button)(() => ({
    textTransform: "none",
    letterSpacing: "1px",
    backgroundColor: "#0096c7",
    ":hover": {
      backgroundColor: " #023e8a",
    },
  }));
  const StyledButton2 = styled(Button)(() => ({
    fontSize: "25px",
    textTransform: "none",
    letterSpacing: "1px",
    backgroundColor: "#0a9396",
    ":hover": {
      backgroundColor: " #005f73",
    },
  }));
  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <Box
        position="fixed"
        sx={{
          py: 1,
          px: 0.5,
          width: "100%",
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <h2 style={{ letterSpacing: "1.5px" }}>AlphaStock</h2>
            </Link>
          </Box>
          <Box display="flex" gap={3}>
            <Link
              to="/authorize"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <StyledButton1 variant="contained">Login / Signup</StyledButton1>
            </Link>
          </Box>
        </Toolbar>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        gap={1}
        width="90%"
        height="100%"
        mx="auto"
        justifyContent="center"
      >
        <Grid
          container
          spacing={3}
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
        >
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column" gap={2}>
              <div className="header1">Welcome to Alpha Stock</div>
              <h2 className="header2">
                Track any Stock any time from any Where!
              </h2>
              <Box textAlign="center">
                <Link
                  to="/authorize"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <StyledButton2 variant="contained">Get Started</StyledButton2>
                </Link>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Logo width="100%" height="100%" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Root;
