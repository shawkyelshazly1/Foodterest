import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  CURRENT_USER,
  FOLLOW_AND_UNFOLLOW_USER,
  LOAD_USER_PROFILE,
} from "../graphql/user";
import { GET_USER_POSTS } from "../graphql/posts";
import { capitalize } from "underscore.string";
import LoadingComponent from "../components/reusable/LoadingComponent";
import numeral from "numeral";
import CreatedPostsComponent from "../components/CreatedPostsComponent";
import SavedBoardsComponent from "../components/SavedBoardsComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import e from "cors";
import { CREATE_BOARD, GET_USER_BOARDS } from "../graphql/board";

export default function Profile() {
  const [selectedPanel, setSelectedPanel] = useState("created");
  const [showMenu, setShowMenu] = useState(false);
  const [showAddBoard, setShowAddBoard] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref]);

  // add board mutation
  const [addBoard, { client }] = useMutation(CREATE_BOARD, {
    onCompleted(data) {
      if (data.createBoard.id) {
        navigate(`/boards/${data.createBoard.id}`);
      }
    },
  });

  // submit form adding board
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { title } = e.target;
    const { value } = title;
    if (value) {
      addBoard({
        variables: {
          title: value,
          privacy: "public",
        },
      });
    }
  };

  // Loading current use from cached data
  const {
    data: { currentUser },
  } = useQuery(CURRENT_USER, {
    fetchPolicy: "cache-only",
  });

  // Follow & unfollow user Mutation
  const [
    followUser,
    { data: followData, loading: followLoading, error: followError },
  ] = useMutation(FOLLOW_AND_UNFOLLOW_USER);

  // Loading user profile query
  const { data, loading, error } = useQuery(LOAD_USER_PROFILE, {
    variables: { username },
    onCompleted({ getUserProfile }) {
      if (!getUserProfile.id) {
        navigate("/404");
      }
    },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  if (!loading && !data) {
    navigate("/404");
  }

  return (
    <div className="w-full h-full ">
      <div className="w-full flex flex-col gap-2 justify-center items-center pt-5 mt-[4rem] ">
        <img
          src={data.getUserProfile.avatar}
          alt=""
          className="w-32 h-32 rounded-full"
        />
        <h1 className="font-semibold text-4xl">
          {capitalize(data.getUserProfile.firstName)}{" "}
          {capitalize(data.getUserProfile.lastName)}
        </h1>
        <p className="text-gray-500">@{data.getUserProfile.username}</p>

        <p className="font-semibold text-[1rem]">
          {numeral(data.getUserProfile.followersCount).format("0a")} followers ·{" "}
          {numeral(data.getUserProfile.followingsCount).format("0a")} following
        </p>
        {currentUser.id === data.getUserProfile.id ? (
          <div className="flex flex-row gap-2 mt-1">
            <button className="rounded-full py-3 px-4 font-semibold hover:bg-gray-500 bg-gray-400 text-white">
              Share
            </button>
            <button className="rounded-full py-3 px-4 font-semibold bg-gray-800 hover:bg-gray-900 text-white">
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-2 mt-1">
            <button className="rounded-full py-3 px-4 font-semibold hover:bg-gray-500 bg-gray-400 text-white">
              Message
            </button>
            <button
              onClick={() => {
                followUser({
                  variables: { username: data.getUserProfile.username },
                });
              }}
              className={`rounded-full py-3 px-4 font-semibold ${
                data.getUserProfile.followed
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-800 hover:bg-gray-900"
              } text-white`}
            >
              {data.getUserProfile.followed ? "Unfollow" : "Follow"}
            </button>
          </div>
        )}

        <div className="flex flex-row mt-14 w-full justify-center items-center px-5">
          <div className="flex-1 flex flex-row justify-center gap-6 pl-8 w-full">
            <p
              className={` ${
                selectedPanel === "created" ? "border-b-4 " : ""
              } font-semibold text-lg border-b-black  pb-2 px-1 cursor-pointer w-fit `}
              onClick={(e) => {
                setSelectedPanel("created");
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Created
            </p>
            <p
              className={` ${
                selectedPanel === "saved" ? "border-b-4 " : ""
              } font-semibold text-lg border-b-black pb-2 px-1 cursor-pointer`}
              onClick={(e) => {
                setSelectedPanel("saved");
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Saved
            </p>
          </div>
          {currentUser.id === data.getUserProfile.id ? (
            <div className="absolute w-full flex items-center ">
              <div className=" absolute flex flex-row gap-2  items-center right-6 ">
                <div
                  ref={ref}
                  className={`${
                    showMenu ? "" : "hidden"
                  } w-fit bg-white custom-shadow-2 py-4 px-2 rounded-xl `}
                >
                  <button
                    className="py-3 px-6 hover:bg-gray-200 rounded-2xl"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowAddBoard(!showAddBoard);
                      setShowMenu(!showMenu);
                      document.body.style.overflowY = "hidden";
                    }}
                  >
                    Create Board
                  </button>
                </div>
                <FontAwesomeIcon
                  icon={faPlus}
                  size="lg"
                  className=" text-center rounded-full custom-shadow-2 p-3 cursor-pointer right-5"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {selectedPanel === "created" ? (
        <CreatedPostsComponent username={username} />
      ) : (
        <SavedBoardsComponent userId={data.getUserProfile.id} />
      )}
      <div
        className={` fixed top-0 left-0 w-full h-full flex items-center  justify-center ${
          showAddBoard ? "" : "hidden"
        }`}
      >
        <div className="bg-gray-300 w-full h-full opacity-50"></div>
        <div className="rounded-2xl fixed felx flex-col bg-white w-2/5  min-h-[350px]  max-h-fit flex justify-center items-center z-50">
          <h1 className="absolute top-5 text-3xl font-medium">
            Create New Board
          </h1>
          <form
            className="flex flex-row gap-2 w-full items-center justify-center"
            onSubmit={(e) => handleFormSubmit(e)}
          >
            <input
              type="text"
              name="title"
              required
              className="py-3 px-4 rounded-full border-2 border-gray-500"
              placeholder="Board Title"
            />
            <button
              type="submit"
              className="rounded-full bg-gray-400 text-white font-semibold hover:bg-gray-500 py-3 px-4 "
            >
              Add Board
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
