import { useQuery } from "@apollo/client";
import React from "react";
import { GET_USER_BOARDS } from "../graphql/board";
import LoadingComponent from "./reusable/LoadingComponent";
import { capitalize } from "underscore.string";
import { useNavigate } from "react-router-dom";

export default function SavedBoardsComponent({ userId }) {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_USER_BOARDS, {
    variables: { userId },
  });
  if (loading || !data)
    return (
      <div className="w-full flex items-center justify-center">
        <LoadingComponent />
      </div>
    );

  return (
    <div className="w-full items-center justify-center flex pt-4 cursor-pointer">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 mt-5 w-10/12  ">
        {data.getUserBoards.map((board) => (
          <div
            className="w-full flex flex-col "
            onClick={() => {
              navigate(`/boards/${board.id}`);
            }}
          >
            <div className="w-full font-semibold text-6xl bg-slate-300 rounded-2xl h-24 sm:h-28 md:h-32 lg:h-36 flex items-center justify-center">
              {capitalize(board.title.split(" ")[0][0])}
              {"."}
              {capitalize(board.title.split(" ")[0][1])}
            </div>
            <div className="w-full flex flex-col pl-2 mt-2">
              <h1 className="font-semibold text-lg"> {board.title}</h1>
              <p className="text-sm">{board.postsCount} Posts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
