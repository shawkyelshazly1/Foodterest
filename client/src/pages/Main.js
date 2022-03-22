import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import LoadingComponent from "../components/reusable/LoadingComponent";
import { CURRENT_USER } from "../graphql/user";
import AuthPage from "./AuthPage";
import PrivateRouter from "./PrivateRouter";

export default function Main() {
  // Fetchin current user to stay up to date and share authentication state
  const { data, loading, error } = useQuery(CURRENT_USER, {
    notifyOnNetworkStatusChange: true,
  });

  if (loading)
    return (
      <div className="flex flex-1 items-center">
        s
        <LoadingComponent />
      </div>
    );

  if (!data) return <AuthPage />;
  else return <PrivateRouter />;
}
