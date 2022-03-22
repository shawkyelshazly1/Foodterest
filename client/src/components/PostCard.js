import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const [showOverlay, setShowOverlay] = useState("hidden");
  return (
    <Link to={`/posts/${post.id}`}>
      <div
        className=" card rounded-2xl cursor-pointer relative"
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
          <h1 className="  text-lg text-white font-bold pt-2 ">{post.title}</h1>
          <Link to={`profile/${post.author.id}`}>
            <div className="absolute bottom-3 flex flex-row items-center gap-2 ">
              <img
                className="w-10 h-10  rounded-full"
                src={post.author.avatar}
                alt=""
              />
              <h1 className="text-white text-lg font-semibold">
                {post.author.username}
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </Link>
  );
}
