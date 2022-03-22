import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import LoadingComponent from "../components/reusable/LoadingComponent";
import { CURRENT_USER } from "../graphql/user";
import AuthPage from "./AuthPage";
import { Routes, Route } from "react-router-dom";
import Main from "./Main";
import PostPage from "./PostPage";
import Profile from "./Profile";
import Navbar from "../components/Navbar";

export default function PrivateRouter({ children }) {
  // Fetchin current user to stay up to date and share authentication state
  const { data, loading, error } = useQuery(CURRENT_USER, {
    notifyOnNetworkStatusChange: true,
  });

  if (loading)
    return (
      <div className="flex flex-1 items-center">
        <LoadingComponent />
      </div>
    );
  if (!data) return <AuthPage />;
  else
    return (
      <div className="flex flex-1 flex-col w-full">
        <Navbar />
        <div className=" flex-1 items-center justify-center flex">
          {children}
        </div>
      </div>
    );
}
