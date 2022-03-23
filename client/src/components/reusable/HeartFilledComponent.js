import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function HeartFilledComponent({ size, onClick }) {
  return (
    <FontAwesomeIcon
      size={size}
      icon={faHeart}
      color="#FE5440"
      className="cursor-pointer"
      onClick={(e) => onClick(e)}
    />
  );
}
