import React from "react";
import Loading from "./Loading";
import { useAuth } from "../Hooks/useAuth";
import { Navigate } from "react-router";

function Protected({ children }) {
  const { loading, user } = useAuth();

  if (loading) {
    // The Loading component needs to be returned to be rendered.
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default Protected;
