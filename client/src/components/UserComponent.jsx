import { useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGOUT_USER } from "../graphql/user";
import { setAccessToken } from "../utils/auth";
import { capitalize } from "underscore.string";

export default function UserComponent({ currentUser }) {
  const navigate = useNavigate();
  const [showDropDown, setShowDropDown] = useState(false);
  const client = useApolloClient();
  const ref = useRef(null);

  const [logoutUser] = useMutation(LOGOUT_USER);

  const toggleDropDown = () => {
    if (showDropDown) {
      setShowDropDown(false);
    } else {
      setShowDropDown(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (showDropDown) {
          setShowDropDown(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [showDropDown]);

  const handleLogout = () => {
    setAccessToken("");
    client.resetStore();
    logoutUser();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <button
        onClick={(e) => toggleDropDown()}
        className="flex flex-row w-full items-center py-2 px-3 focus:ring-2  rounded-full focus:ring-blue-400 text-white"
      >
        <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full" />
        <svg
          className="ml-2 w-5 h-5"
          fill="black"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
        <div
          ref={ref}
          style={{ boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
          className={`${
            showDropDown ? "" : "hidden"
          } bg-white absolute text-black flex z-40 items-start flex-col gap-2 break-all rounded-xl px-1 top-14 py-4 min-w-[200px]   right-0 mr-2 `}
        >
          <Link to={`/profile/${currentUser.username}`}>
            <div className="flex flex-row  items-center justify-center gap-2 hover:bg-gray-200 px-6 my-2 py-2 rounded-lg cursor-pointer">
              <img
                src={currentUser.avatar}
                alt=""
                className="w-11 h-11 rounded-full"
              />
              <div className="flex flex-col ">
                <p className="font-bold text-lg">
                  {capitalize(currentUser.firstName)}{" "}
                  {capitalize(currentUser.lastName)}
                </p>
                <p className="text-gray-500">{currentUser.email}</p>
              </div>
            </div>
          </Link>
          <div className="flex flex-col gap-2 w-full  ">
            <Link
              className="hover:bg-gray-200 items-start flex  px-6 rounded-full py-2 font-semibold"
              to="#"
            >
              Settings
            </Link>
            <div
              onClick={(_) => {
                handleLogout();
              }}
              className="hover:bg-gray-200 flex items-start justify-start  px-6 rounded-full py-2 font-semibold"
              to="/"
            >
              Logout
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
