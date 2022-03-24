import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  CURRENT_USER,
  FOLLOW_AND_UNFOLLOW_USER,
  LOAD_USER_PROFILE,
} from "../graphql/user";
import { GET_USER_POSTS } from "../graphql/posts";
import { capitalize } from "underscore.string";
import LoadingComponent from "../components/reusable/LoadingComponent";
import Masonry from "react-masonry-css";
import PostCard from "../components/PostCard";
import numeral from "numeral";

export default function Profile() {
  const [selectedPanel, setSelectedPanel] = useState("created");
  const { username } = useParams();

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

  // Lazy query to load user posts after profile loaded
  const [
    loadUserPosts,
    { data: posts, loading: loadingPosts, error: postsError },
  ] = useLazyQuery(GET_USER_POSTS, {
    variables: { username },
    fetchPolicy: "cache-first",
  });

  // Loading user profile query
  const { data, loading, error } = useQuery(LOAD_USER_PROFILE, {
    variables: { username },
    onCompleted({ getUserProfile }) {
      if (getUserProfile.id) {
        loadUserPosts();
      }
    },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const breakpointColumnsObj = {
    default: 5,
    1700: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-col gap-2 justify-center items-center pt-5">
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

        <div className="flex flex-row gap-6 mt-14">
          <p
            className={` ${
              selectedPanel === "created" ? "border-b-4 " : ""
            } font-semibold text-lg border-b-black pb-2 px-1 cursor-pointer`}
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
      </div>
      {loadingPosts || !posts ? (
        <div className="w-full flex items-center justify-center">
          <LoadingComponent />
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex masonry-grid-style"
          columnClassName="masonry-grid_column-style"
        >
          {posts.getUserPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              // handleEditModal={handleEditModal}
            />
          ))}
        </Masonry>
      )}
    </div>
  );
}
