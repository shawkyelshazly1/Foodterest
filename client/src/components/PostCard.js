import React, { useState } from "react";
import { Link } from "react-router-dom";
import { capitalize } from "underscore.string";
import HeartFilledComponent from "./reusable/HeartFilledComponent";
import HeartUnfilledComponent from "./reusable/HeartUnfilledComponent";
import CommentFilledComponent from "./reusable/CommentFilledComponent";
import { useMutation, useQuery } from "@apollo/client";
import { LIKE_POST } from "../graphql/posts";
import { useNavigate } from "react-router-dom";
import EditPost from "./EditPost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { CURRENT_USER } from "../graphql/user";

export default function PostCard({ post, handleEditModal }) {
  const [showOverlay, setShowOverlay] = useState("hidden");
  const navigate = useNavigate();

  // Loading current use from cached data
  const {
    data: { currentUser },
  } = useQuery(CURRENT_USER, {
    fetchPolicy: "cache-only",
  });

  const [likePost] = useMutation(LIKE_POST);

  const HandleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    likePost({
      variables: { postId: post.id },
    });
  };

  const openEditModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleEditModal(post);
  };

  const goUserProfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`profile/${post.author.username}`);
  };

  return (
    <>
      <div
        onClick={() => {
          navigate(`/posts/${post.id}`);
        }}
        className=" rounded-2xl relative w-full my-4  bg-gray-50 "
        onMouseEnter={() => {
          setShowOverlay("");
        }}
        onMouseLeave={() => setShowOverlay("hidden")}
      >
        <img className="MediaCard rounded-2xl w-full" src={post.image} alt="" />
        <div
          className={` ${showOverlay} absolute w-full h-full rounded-2xl  z-20 bg-black opacity-30 top-0 left-0 flex flex-col p-3`}
        ></div>
        <div
          className={` ${showOverlay} absolute w-full h-full  rounded-2xl z-30 top-0 left-0 flex flex-col p-3 pl-4  `}
        >
          <div className="flex flex-col gap-1">
            <h1 className="  text-lg text-white font-bold pt-2 ">
              {capitalize(post.title)}
            </h1>
            <div className="flex flex-row gap-3 pl-1 items-center">
              {post.liked ? (
                <div className="flex f</div>lex-row items-center gap-1">
                  <HeartFilledComponent size="xl" onClick={HandleLike} />
                  <p className="text-white font-Roboto font-medium text-lg">
                    {post.likesCount}
                  </p>
                </div>
              ) : (
                <div className="flex flex-row items-center gap-1">
                  <HeartUnfilledComponent size="xl" onClick={HandleLike} />
                  <p className="text-white font-Roboto font-medium text-lg">
                    {post.likesCount}
                  </p>
                </div>
              )}
              <div className="flex flex-row items-center gap-1">
                <CommentFilledComponent size="xl" />
                <p className="text-white font-Roboto font-medium text-lg">
                  {post.commentsCount}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-3 flex flex-row items-center gap-2 justify-between w-full">
            <div
              className=" flex flex-row items-center gap-2 cursor-pointer"
              onClick={(e) => {
                goUserProfile(e);
              }}
            >
              <img
                className="w-10 h-10  rounded-full"
                src={post.author.avatar}
                alt=""
              />
              <h1 className="text-white text-lg font-semibold">
                {capitalize(post.author.username)}
              </h1>
            </div>

            {currentUser.id === post.author.id ? (
              <div
                className="ml-auto cursor-pointer mr-9"
                onClick={(e) => {
                  openEditModal(e);
                }}
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  size="2x"
                  color="white"
                  className="z-50"
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
