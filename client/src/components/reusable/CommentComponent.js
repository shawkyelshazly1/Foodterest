import React from "react";

export default function CommentComponent({ comment }) {
  return (
    <div className="flex flex-row gap-3">
      <img
        src={comment.author.avatar}
        alt=""
        className="w-12 h-12 rounded-full"
      />
      <h1 className="flex-1 rounded-2xl py-2 border-2 outline-slate-600 px-4">
        {comment.content}
      </h1>
    </div>
  );
}
