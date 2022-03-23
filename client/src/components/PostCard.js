import React, { useState } from "react";
import { Link } from "react-router-dom";
import { capitalize } from "underscore.string";
import HeartFilledComponent from "./reusable/HeartFilledComponent";
import HeartUnfilledComponent from "./reusable/HeartUnfilledComponent";
import CommentFilledComponent from "./reusable/CommentFilledComponent";
import { useMutation } from "@apollo/client";
import { LIKE_POST } from "../graphql/posts";

export default function PostCard({ post }) {
  const [showOverlay, setShowOverlay] = useState("hidden");

  const [likePost] = useMutation(LIKE_POST);

  const HandleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    likePost({
      variables: { postId: post.id },
    });
  };

  return (
    <Link to={`/posts/${post.id}`} className="cursor-default">
      <div
        className=" card rounded-2xl relative"
        onMouseEnter={() => {
          setShowOverlay("");
        }}
        onMouseLeave={() => setShowOverlay("hidden")}
      >
        <img
          className="MediaCard rounded-2xl w-full h-full"
          src={post.image}
          alt=""
        />
        <div
          className={` ${showOverlay} absolute w-full h-full  z-20 bg-black opacity-70 top-0 left-0 flex flex-col p-3`}
        ></div>
        <div
          className={` ${showOverlay} absolute w-full h-full  z-30 top-0 left-0 flex flex-col p-3 pl-4  `}
        >
          <div className="flex flex-col gap-1">
            <h1 className="  text-lg text-white font-bold pt-2 ">
              {capitalize(post.title)}
            </h1>
            <div className="flex flex-row gap-3 pl-1 items-center">
              {post.liked ? (
                <div className="flex flex-row items-center gap-1">
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

          <Link to={`profile/${post.author.username}`}>
            <div className="absolute bottom-3 flex flex-row items-center gap-2 ">
              <img
                className="w-10 h-10  rounded-full"
                src={post.author.avatar}
                alt=""
              />
              <h1 className="text-white text-lg font-semibold">
                {capitalize(post.author.username)}
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </Link>
  );
}
