import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import WorkIcon from "@mui/icons-material/Work";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { auth } from "../fireConfig";
import { useNavigate } from "react-router-dom";
import { Button, Divider, ThemeProvider, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme } from "@mui/material/styles";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const buttonTheme = createTheme({
    typography: {
      button: {
        textTransform: "none",
        letterSpacing: "1px",
        fontSize: 16,
        fontWeight: 700,
      },
    },
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (matches === false) {
      setAnchorEl(null);
    }
  }, [matches]);

  return (
    <Box sx={{ flexGrow: 1 }} mb={5}>
      <AppBar position="static" sx={{ backgroundColor: "rgb(5 150 105)" }}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: "2px",
            }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              AlphaStock
            </Link>
          </Typography>
          {matches ? (
            <div>
              <Tooltip title="Open Menu" arrow>
                <IconButton
                  size="large"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                sx={{ mt: "45px" }}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate("/portfolio");
                  }}
                  sx={{ my: 1 }}
                >
                  <ListItemIcon>
                    <WorkIcon fontSize="small" />
                  </ListItemIcon>
                  Portfolio
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate("/settings");
                  }}
                  sx={{ my: 1 }}
                >
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    auth.signOut();
                    navigate("/authorize");
                  }}
                  sx={{ my: 1 }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <ThemeProvider theme={buttonTheme}>
              <Box display="flex" columnGap={4}>
                <Button
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    ":hover": {
                      bgcolor: "white",
                      color: "black",
                    },
                  }}
                  onClick={() => navigate("/portfolio")}
                >
                  Portfolio
                </Button>
                <Button
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    ":hover": {
                      bgcolor: "white",
                      color: "black",
                    },
                  }}
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </Button>
                <Button
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    ":hover": {
                      bgcolor: "white",
                      color: "black",
                    },
                  }}
                  onClick={() => {
                    auth.signOut();
                    navigate("/authorize");
                  }}
                >
                  Logout
                </Button>
              </Box>
            </ThemeProvider>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
