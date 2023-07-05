import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@apollo/client";
import { UPDATE_POST } from "../graphql/posts";

export default function EditPost({ showModal, postToEdit, handleEditModal }) {
  const [isLargeImage, setIsLargeImage] = useState(false);

  const [updatePost] = useMutation(UPDATE_POST, {
    
  });

  const handleImageStyle = () => {
    const renderedHeight = document.getElementById("image").clientHeight;
    if (renderedHeight > 500) {
      setIsLargeImage(true);
    } else {
      setIsLargeImage(false);
    }
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();
    updatePost({
      variables: {
        postId: postToEdit.id,
        title: e.target[0].value,
      },
    });
    handleEditModal("");
  };

  if (!postToEdit) {
    return null;
  }

  return (
    <div
      className={` ${
        showModal ? "" : "hidden"
      } fixed items-center flex justify-center h-full w-full top-0 left-0 z-50`}
    >
      <div className="w-full h-full bg-black opacity-70 "></div>
      <div className="absolute  bg-white w-3/5 min-h-[500px] max-h-fit flex flex-row justify-between gap-4 rounded-3xl mt-5">
        {isLargeImage ? (
          <div className="w-full h-full">
            <img
              onLoad={() => {
                handleImageStyle();
              }}
              id="image"
              className="rounded-tl-3xl rounded-bl-3xl"
              src={postToEdit.image}
              alt=""
            />
          </div>
        ) : (
          <div className="w-full h-full p-7">
            <img
              onLoad={() => {
                handleImageStyle();
              }}
              id="image"
              className="rounded-xl"
              src={postToEdit.image}
              alt=""
            />
          </div>
        )}

        <div className="w-full h-full min-h-fit max-h-fit py-5 px-6 flex flex-col mt-16 gap-8 pr-6 ">
          <form
            className="flex flex-col gap-5 items-center"
            onSubmit={(e) => {
              handleUpdatePost(e);
            }}
          >
            <input
              min={1}
              required
              type="text"
              placeholder="Add your New title"
              className=" font-semibold text-3xl border-b-2 p-2 focus:outline-none focus:border-b-blue-400"
            />
            <button
              className="py-2 px-4 rounded-full font-semibold text-xl text-white bg-slate-500"
              type="submit"
            >
              Update
            </button>
          </form>
        </div>
        <FontAwesomeIcon
          onClick={() => {
            handleEditModal("");
          }}
          icon={faCircleXmark}
          size="2x"
          color="black"
          className="absolute top-3 right-3 cursor-pointer"
        />
      </div>
    </div>
  );
}
