import {
  Button,
  Divider,
  Tooltip,
  AppBar,
  Box,
  Toolbar,
  Typography,
  Menu,
} from "@mui/material";
import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import WorkIcon from "@mui/icons-material/Work";
import MenuItem from "@mui/material/MenuItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { auth } from "../fireConfig";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const StyledButton = styled(Button)(() => ({
    textTransform: "none",
    letterSpacing: "1px",
    fontSize: 16,
    fontWeight: 700,
    ":hover": {
      color: "black",
      backgroundColor: "#E9E8E8",
    },
    my: 2,
    color: "white",
    display: "block",
    transition: "0.3 ease out",
  }));

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
            <Link
              to="/home"
              style={{ textDecoration: "none", color: "inherit" }}
            >
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
                    navigate("/profile");
                  }}
                  sx={{ my: 1 }}
                >
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    auth.signOut();
                    navigate("/");
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
            <Box display="flex" columnGap={4}>
              <StyledButton onClick={() => navigate("/portfolio")}>
                Portfolio
              </StyledButton>
              <StyledButton onClick={() => navigate("/profile")}>
                Profile
              </StyledButton>
              <StyledButton
                onClick={() => {
                  auth.signOut();
                  navigate("/");
                }}
              >
                Logout
              </StyledButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
