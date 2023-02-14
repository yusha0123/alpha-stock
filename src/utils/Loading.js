import React from "react";
import { CircularProgress, Stack } from "@mui/material";

const Loading = () => {
  return (
    <Stack sx={{ height: "100vh" }} justifyContent="center" alignItems="center">
      <CircularProgress color="secondary" />
    </Stack>
  );
};

export default Loading;
