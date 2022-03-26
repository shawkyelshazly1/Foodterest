import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import LoadingComponent from "../components/reusable/LoadingComponent";
import { CURRENT_USER } from "../graphql/user";
import AuthPage from "./AuthPage";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import AddPostBtnComponent from "../components/AddPostBtnComponent";

export default function PrivateRouter({ children }) {
  const location = useLocation();
  // Fetchin current user to stay up to date and share authentication state
  const { data, loading } = useQuery(CURRENT_USER, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (loading) return null;
  if (!data) return <AuthPage />;
  else
    return (
      <div className="flex flex-1 flex-col w-full">
        <Navbar />
        <div className=" flex-1 items-center justify-center flex relative mt-[48px]">
          {children}
          <AddPostBtnComponent />
        </div>
      </div>
    );
}
