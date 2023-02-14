import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../fireConfig";
import Loading from "./Loading";
import Navbar from "../components/Navbar";

function PrivateRoutes() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <Loading />;
  }
  if (user) {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  }
  return <Navigate to="/authorize" />;
}

export default PrivateRoutes;
