import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

export default function HeartUnfilledComponent({ size, onClick, cursor }) {
  return (
    <FontAwesomeIcon
      size={size}
      icon={faHeart}
      color="#FE5440"
      className={`${cursor}`}
      onClick={(e) => onClick(e)}
    />
  );
}
