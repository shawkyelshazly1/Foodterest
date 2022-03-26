import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { CURRENT_USER } from "../graphql/user";
import { ADD_COMMENT, GET_POST_COMMENTS } from "../graphql/comment";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "./reusable/LoadingComponent";
import CommentComponent from "./CommentComponent";

export default function CommentsComponent({ postId }) {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  // Loading current use from cached data
  const {
    data: { currentUser },
  } = useQuery(CURRENT_USER, {
    fetchPolicy: "cache-only",
  });

  // Loading post query
  const {
    data: postComments,
    loading: loadingComments,
    error: errorComments,
  } = useQuery(GET_POST_COMMENTS, {
    variables: { postId },
    onError(error) {
      navigate("/404");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [addComment, { data, loading, error, client }] = useMutation(
    ADD_COMMENT,
    {
      onCompleted(data) {
        if (data.addComment) {
          let commentAdded = data.addComment.comments[0];
          client.cache.updateQuery(
            {
              query: GET_POST_COMMENTS,
              variables: { postId: postId },
            },
            (data) => ({
              getPostComments: [commentAdded, ...data.getPostComments],
            })
          );
        }
      },
    }
  );

  const autoGrow = (elem) => {
    setComment(elem.target.innerText);
    elem.target.style.height = "100%";
    elem.target.style.height = elem.target.scrollHeight + "px";
  };

  const handleAddComment = () => {
    if (comment.trim() !== "") {
      addComment({
        variables: { postId, content: comment.trim() },
      });
      setComment("");
      document.getElementById("commentInput").innerText = "";
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-full">
      {loadingComments && !postComments ? (
        <LoadingComponent />
      ) : postComments.getPostComments ? (
        postComments.getPostComments.map((comment) => (
          <CommentComponent comment={comment} key={comment.id} />
        ))
      ) : null}

      <div className="flex flex-row gap-3 mt-3">
        <img
          src={currentUser.avatar}
          alt=""
          className="h-12 w-12 rounded-full"
        />
        <div className="flex flex-col w-full h-full gap-2">
          {/* <textarea
            onInput={autoGrow.bind(this)}
            placeholder="Add Comment"
            className={`resize-none overflow-hidden placeholder:translate-y-2/4 placeholder:text-md  placeholder:text-slate-400 placeholder:font-semibold  focus:placeholder:translate-y-1 focus:py-2 min-h-full flex-1 rounded-full border-2 outline-slate-600 px-4 focus:rounded-2xl focus:border-blue-400  focus:outline-none break-words ${
              comment.trim() !== "" ? "rounded-2xl border-blue-400" : ""
            }`}
          /> */}
          <div
            id="commentInput"
            data-placeholder="s"
            role="textbox"
            onInput={autoGrow.bind(this)}
            contentEditable
            className={` py-2 h-full  empty:before:translate-y-2/4 empty:before:content-["Add_Comment"] empty:before:text-slate-400 empty:before:text-md  empty:before:font-semibold  resize-none overflow-hidden  w-full  focus:placeholder:translate-y-1 focus:py-2 rounded-full border-2 outline-slate-600 px-4 focus:rounded-2xl focus:border-blue-400  focus:outline-none break-all ${
              comment.trim() !== "" ? "rounded-2xl border-blue-400" : ""
            }`}
          ></div>
          <button
            onClick={() => {
              handleAddComment();
            }}
            className={` ${
              comment.trim() !== "" ? "" : "hidden"
            } ml-auto text-lg text-black font-semibold  bg-[#E9E9EB] rounded-full py-2 px-5 hover:text-white hover:bg-slate-500`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
