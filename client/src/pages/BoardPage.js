import { useQuery } from "@apollo/client";
import React from "react";
import Masonry from "react-masonry-css";
import { useParams } from "react-router";
import { capitalize } from "underscore.string";
import EditPost from "../components/EditPost";
import PostCard from "../components/PostCard";
import LoadingComponent from "../components/reusable/LoadingComponent";
import { GET_BOARD } from "../graphql/board";
import { CURRENT_USER } from "../graphql/user";

export default function BoardPage() {
  const { boardId } = useParams();

  // Loading current use from cached data
  const {
    data: { currentUser },
  } = useQuery(CURRENT_USER, {
    fetchPolicy: "cache-only",
  });

  // handle delete board
  const handleDeleteBoard = () => {};

  const { data, loading, error } = useQuery(GET_BOARD, {
    variables: { boardId },
  });

  const breakpointColumnsObj = {
    default: 6,
    1700: 5,
    1100: 4,
    700: 3,
    500: 2,
    300: 1,
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="relative w-full h-full flex flex-col mt-28">
      {data.getBoard.author.id === currentUser.id ? (
        <div className="flex flex-col w-full items-center gap-2">
          <h1 className="text-black text-3xl font-semibold">
            {data.getBoard.title}
          </h1>
          <img
            src={data.getBoard.author.avatar}
            alt=""
            className="w-14 h-14 rounded-full"
          />
          <p>{data.getBoard.postsCount} Posts</p>
          <div className="flex flex-rwo gap-2 items-center justify-center">
            <button className="rounded-full py-2 px-5 font-semibold text-white bg-gray-500 hover:bg-gray-600">
              Edit
            </button>
            <button className="rounded-full py-2 px-5 font-semibold text-white bg-red-500 hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full items-center gap-2">
          <h1 className="text-black text-3xl font-semibold">
            {data.getBoard.title}
          </h1>
          <p>{data.getBoard.postsCount} Posts</p>
          <img
            src={data.getBoard.author.avatar}
            alt=""
            className="w-14 h-14 rounded-full"
          />

          <h1>
            Collection by{" "}
            <span className="font-semibold">
              {capitalize(data.getBoard.author.firstName)}{" "}
              {capitalize(data.getBoard.author.lastName)}
            </span>
          </h1>
        </div>
      )}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex masonry-grid-style mt-1 justify-center"
        columnClassName="masonry-grid_column-style"
      >
        {data.getBoard.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Masonry>
    </div>
  );
}
