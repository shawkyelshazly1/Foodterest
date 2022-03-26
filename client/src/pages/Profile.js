import React, { useState } from "react";
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

export default function Profile() {
  const [selectedPanel, setSelectedPanel] = useState("created");
  const { username } = useParams();
  const navigate = useNavigate();

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
    <div className="w-full h-full">
      <div className="w-full flex flex-col gap-2 justify-center items-center pt-5 mt-[4rem]">
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
          <div className="flex-1 flex flex-row justify-center gap-6 pl-8">
            <p
              className={` ${
                selectedPanel === "created" ? "border-b-4 " : ""
              } font-semibold text-lg border-b-black  pb-2 px-1 cursor-pointer w-fit `}
              onClick={() => {
                setSelectedPanel("created");
              }}
            >
              Created
            </p>
            <p
              className={` ${
                selectedPanel === "saved" ? "border-b-4 " : ""
              } font-semibold text-lg border-b-black pb-2 px-1 cursor-pointer`}
              onClick={() => {
                setSelectedPanel("saved");
              }}
            >
              Saved
            </p>
          </div>
          <FontAwesomeIcon
            icon={faPlus}
            size="lg"
            className="text-center rounded-full custom-shadow-2 p-3 cursor-pointer"
          />
        </div>
      </div>
      {selectedPanel === "created" ? (
        <CreatedPostsComponent username={username} />
      ) : (
        <SavedBoardsComponent userId={data.getUserProfile.id} />
      )}
    </div>
  );
}
