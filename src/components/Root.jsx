import React from "react";
import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { ReactComponent as Logo } from "../utils/root.svg";
import { Link } from "react-router-dom";

const Root = () => {
  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{ backgroundColor: "#fff", color: "black", py: 1, px: 0.5 }}
          elevation={0}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AlphaStock
            </Typography>
            <Box display="flex" gap={3}>
              <Link
                to="/authorize"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button variant="contained">Login / Signup</Button>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Box display="flex" alignItems="center" gap={1} width="90%" mx="auto">
        <Grid
          container
          spacing={3}
          direction={{ xs: "column", lg: "row" }}
          alignItems="center"
          paddingTop={5}
        >
          <Grid item xs={12} md={6}>
            <h1 className="header1">Welcome to Alpha Stock</h1>
            <h2 className="header2">
              Track any Stock any time from any Where!
            </h2>
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
