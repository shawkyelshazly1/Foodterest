import { useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { CURRENT_USER } from "../graphql/user";
import SerachBar from "./SerachBar";
import NotificationIcon from "./reusable/NotificationIcon";
import UserComponent from "./UserComponent";

export default function Navbar() {
  const { data, loading, error } = useQuery(CURRENT_USER, {
    notifyOnNetworkStatusChange: true,
  });

  if (loading) return null;
  return (
    <div className="flex flex-row min-h-[70px] w-full px-5 py-3 justify-between items-center gap-2 navbar-shadow fixed z-50 bg-white">
      <Link to="/">
        <img
          src="https://res.cloudinary.com/dwufx31ox/image/upload/q_auto,f_auto/v1648284906/Foodterest/logo_transparent_thisob.png"
          alt="logo"
          className="w-[80px] h-[60px]"
        />
      </Link>
      <Link to="/">
        <button className=" bg-black text-white rounded-full py-2 px-3 font-semibold">
          Home
        </button>
      </Link>
      <div className="flex-1">
        <SerachBar />
      </div>
      <div className="flex flex-row gap-2 ml-2">
        <NotificationIcon />
        <UserComponent currentUser={data.currentUser} />
      </div>
    </div>
  );
}
