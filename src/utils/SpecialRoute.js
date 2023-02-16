import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../fireConfig";
import Loading from "./Loading";

function SpecialRoute() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <Loading />;
  }
  if (!user) {
    return <Outlet />;
  }
  return <Navigate to="/home" />;
}

export default SpecialRoute;
