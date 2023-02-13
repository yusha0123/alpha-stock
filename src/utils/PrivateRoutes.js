import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../fireConfig";
import { CircularProgress, Stack } from "@mui/material";

function PrivateRoutes() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <Stack
        sx={{ height: "100vh" }}
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="inherit" />
      </Stack>
    );
  }
  if (user) {
    return <Outlet />;
  }
  return <Navigate to="/authorize" />;
}

export default PrivateRoutes;
