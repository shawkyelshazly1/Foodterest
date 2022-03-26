import { useMutation, useQuery } from "@apollo/client";
import React, { useRef, useEffect } from "react";
import { ADD_POST_TO_BOARD } from "../graphql/board";
import { CURRENT_USER } from "../graphql/user";

export default function SaveToBoard({
  postId,
  showBoardsMenu,
  setShowBoardsMenu,
  setSavedToBoard,
}) {
  const ref = useRef(null);
  // Loading current use from cached data
  const {
    data: { currentUser },
  } = useQuery(CURRENT_USER, {
    fetchPolicy: "cache-only",
  });

  // add post to board mutation
  const [addToBoard] = useMutation(ADD_POST_TO_BOARD);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (showBoardsMenu) {
          setShowBoardsMenu(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [postId, showBoardsMenu, setShowBoardsMenu]);

  // Handling saving to Board
  const handleSaveToBoard = (e, boardId) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedToBoard(true);
    setShowBoardsMenu(false);
    addToBoard({ variables: { postId, boardId } });
  };

  return (
    <div className="flex flex-col gap-1  w-full top-0 left-0 absolute z-50">
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        ref={ref}
        className={`z-50 absolute ${
          showBoardsMenu ? "" : "hidden"
        } bg-white rounded-xl w-[105%] h-[400px] top-14 left-0  py-4 px-1 custom-shadow-2 text-center`}
      >
        <h1 className="font-semibold text-lg pb-2">Save to board</h1>
        <div className="flex flex-col gap-2 overflow-y-auto h-[95%]">
          {currentUser.boards.map((board) => (
            <div
              onClick={(e) => handleSaveToBoard(e, board.id)}
              key={board.id}
              className="hover:bg-slate-200 gap-2 py-2 px-2 w-full flex flex-row justify-between items-center rounded-lg cursor-pointer"
            >
              <h1 className="font-medium text-lg ">{board.title}</h1>
              <button
                onClick={(e) => handleSaveToBoard(e, board.id)}
                className="ml-auto hover:bg-gray-600 py-2 px-4 rounded-full bg-gray-500 text-white font-semibold"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
