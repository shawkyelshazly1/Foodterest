import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function AddPostBtnComponent() {
  const navigate = useNavigate();
  return (
    <div
      className="fixed bottom-6 right-6 bg-[#fff] rounded-full p-4 cursor-pointer hover:bg-gray-200"
      onClick={() => {
        navigate("/create-post");
      }}
      style={{ boxShadow: " 0px 0px 8px 3px rgba(0,0,0,0.1)" }}
    >
      <FontAwesomeIcon icon={faPlus} size="2xl" />
    </div>
  );
}
